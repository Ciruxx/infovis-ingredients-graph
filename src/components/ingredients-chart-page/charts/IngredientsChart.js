import React, {Component} from 'react'
import VisNetworkReactComponent from "vis-network-react";
import {getAreas, getMealsByArea, getMealDetails} from '../../../data/TheMealDB'
import Drawer from "../../drawer";
import Typography from "@material-ui/core/Typography";
import YouTube from 'react-youtube';
import * as _ from 'lodash';

const options = {
    autoResize: true,
    groups: {
        myGroup: {color: "#e04141", borderWidth: 3}
    },
    layout: {
        hierarchical: false
    },
    physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
            damping: 0.1
        }
    },
    interaction: {
        multiselect: true
    },
    edges: {
        color: "#000000"
    }
};

class IngredientsChart extends Component {
    clicks = 0

    constructor(props) {
        super(props);

        this.getNetwork = this.getNetwork.bind(this)
        this.singleClick = this.singleClick.bind(this)
        this.rightClick = this.rightClick.bind(this)
        this.doubleClick = this.doubleClick.bind(this)
        this.drawerOnClose = this.drawerOnClose.bind(this)
        this.getContent = this.getContent.bind(this)

        this.events = {
            select: this.singleClick,
            doubleClick: this.doubleClick,
            "oncontext": this.rightClick
        };

        this.state = {
            network: null,
            graph: {
                nodes: [],
                edges: []
            }
        }
    }

    componentDidMount() {
        getAreas()
            .then((response) => {
                const areas = response.data.meals.map((item) => {
                    const imageUrl = (item.strArea !== "Unknown")?
                        `https://www.countryflags.io/${this.getCountryCode(item.strArea)}/shiny/64.png` :
                        "https://asgardia.space/assets/images/national-symbols/coatofarms.94320.png"; // For fun
                    return {
                        id: item.strArea,
                        label: item.strArea,
                        color: "#41e0c9",
                        shape: "image",
                        image: imageUrl,
                        type: "area"
                    }
                })
                const nodes = this.state.graph.nodes.slice().concat(areas);
                const edges = this.state.graph.edges.slice().concat([]);
                this.setState({
                    graph: {
                        nodes,
                        edges
                    }
                });
            })
            .catch(console.error)
    }

    rightClick(event) {
        event.event.preventDefault();
        const { network, graph } = this.state;
        const id = network.getNodeAt(event.pointer.DOM)
        const node = this.state.graph.nodes.find((node) => node.id === id)
        if(!node) return;
        const { type } = node;

        let nodes = graph.nodes.slice();
        let edges = graph.edges.slice();

        console.log(graph)
        let nodesToRemove = []
        let edgesToRemove = []
        switch (type) {
            case "area": {
                console.log("Country id:", id)
                const connectedMealNodesIds = network.getConnectedNodes(id)
                console.log("Connected Meals:")
                console.log(connectedMealNodesIds)
                nodesToRemove = nodesToRemove.concat(connectedMealNodesIds)
                const connectedMealEdgesIds = network.getConnectedEdges(id)
                edgesToRemove = edgesToRemove.concat(connectedMealEdgesIds)

                for (const nodeMealId of connectedMealNodesIds) {
                    console.log("Meal id:", nodeMealId)
                    const connectedIngredientsNodesIds = network.getConnectedNodes(nodeMealId)
                    console.log("Connected Ingredients:")
                    console.log(connectedIngredientsNodesIds)
                    for (const nodeIngredientId of connectedIngredientsNodesIds) {
                        const ingredientEdges = network.getConnectedEdges(nodeIngredientId)
                        console.log("Archi connessi all'ingrediente: ", nodeIngredientId, ingredientEdges.length)
                        console.log(ingredientEdges)
                        if (ingredientEdges.length === 1) {
                            console.log("Da Rimuovere")
                            nodesToRemove.push(nodeIngredientId)
                        }
                    }
                    const connectedIngredientsEdgesIds = network.getConnectedEdges(nodeMealId)
                    edgesToRemove = edgesToRemove.concat(connectedIngredientsEdgesIds)

                    edges = this.nodeDifference(edges, edgesToRemove);

                    // Se non si tolgono subito gli archi non cambia il numero di archi nel controllo su ingredientEdges.length
                    this.setState({
                        graph:{
                            nodes,
                            edges
                        }
                    })
                }

                nodesToRemove = nodesToRemove.filter((value) => value !== id); // Do not remove the root node
                break;
            }
            case "meal": {
                console.log("Meal id:", id)
                const connectedIngredientsNodesIds = network.getConnectedNodes(id)
                console.log("Connected Ingredients:")
                console.log(connectedIngredientsNodesIds)
                for (const nodeIngredientId of connectedIngredientsNodesIds) {
                    const ingredientEdges = network.getConnectedEdges(nodeIngredientId)
                    console.log("Archi connessi all'ingrediente: ", nodeIngredientId, ingredientEdges.length)
                    console.log(ingredientEdges)
                    if (ingredientEdges.length === 1) {
                        console.log("Da Rimuovere")
                        nodesToRemove.push(nodeIngredientId)
                    }
                }
                const connectedIngredientsEdgesIds = network.getConnectedEdges(id)
                edgesToRemove = edgesToRemove.concat(connectedIngredientsEdgesIds)

                const edge = this.state.graph.edges.find((edge) => edge.to === id && edge.type === "area") // TODO Refactor!
                edgesToRemove = edgesToRemove.filter((value) => value !== edge.id); // Do not remove the root edge
                break;
            }
            default:{
                return
            }
        }

        nodes = this.nodeDifference(nodes, nodesToRemove);
        edges = this.nodeDifference(edges, edgesToRemove);

        this.setState({
            graph:{
                nodes,
                edges
            }
        })
    }

    nodeDifference(nodes, nodesToRemove) {
        return nodes.filter(e => !nodesToRemove.find(a => e.id === a));
    }

    singleClick(event) {
        const {nodes} = event;
        this.clicks++;
        setTimeout(() => {
            if (this.clicks === 1) {
                if (nodes[0] == null) {
                    this.clicks = 0;
                    return
                }
                const id = nodes[0];
                const node = this.state.graph.nodes.find((node) => node.id === id)
                if (node.type === "area") return; // If area not open the drawer
                this.getContent(id).then((content) => {
                    this.setState({
                        drawer: {
                            open: true,
                            content: () => content
                        }
                    })
                })
            }
            this.clicks = 0;
        }, 300);
    }
    getContent(id) {
        return new Promise((resolve, reject) => {
            const node = this.state.graph.nodes.find((node) => node.id === id)
            switch (node.type) {
                case "meal": {
                    getMealDetails(node.label)
                        .then((response) => {
                            const {meals} = response.data;
                            const {strMealThumb, strMeal, strInstructions, strYoutube} = meals[0];
                            const regex = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/;
                            const youtubeId = strYoutube.match(regex)[1];
                            resolve((
                                <div>
                                    <img src={strMealThumb} alt={"Meal"} style={{
                                        "max-width": "100%",
                                        height: "auto"
                                    }}/>
                                    <div style={{padding: "20px"}}>
                                        <Typography gutterBottom variant="h4" component="h2">
                                            {strMeal}
                                        </Typography>

                                        <Typography variant="body1" color="textSecondary" component="p">
                                            {strInstructions}
                                        </Typography>
                                        <br/>
                                        <br/>
                                        <YouTube videoId={youtubeId} opts={{
                                            height: '390',
                                            width: '100%',
                                            playerVars: {
                                                autoplay: 0,
                                            },
                                        }}/>
                                    </div>
                                </div>
                            ))
                        })
                        .catch(reject);
                    break;
                }
                case "ingredient":{
                    resolve((
                        <div>
                            <img src={encodeURI(`https://www.themealdb.com/images/ingredients/${node.label}.png`)} alt={"Ingredient"} style={{
                                "max-width": "100%",
                                height: "auto"
                            }}/>
                            <div style={{padding: "20px"}}>
                                <Typography gutterBottom variant="h4" component="h2">
                                    {node.label}
                                </Typography>
                            </div>
                        </div>
                    ))
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    doubleClick(event) {
        const {nodes} = event;
        if (nodes[0] == null) return
        const id = nodes[0];
        const node = this.state.graph.nodes.find((node) => node.id === id) // TODO Refactor!
        const {label, type} = node;
        switch (type) {
            case "area": {
                getMealsByArea(label).then((response) => {
                    const {meals} = response.data;
                    const newNodes = [];
                    const newEdges = [];
                    for (const meal of meals) {
                        const {strMeal, strMealThumb} = meal;
                        newNodes.push({
                            id: strMeal,
                            label: strMeal,
                            color: "#e0df41",
                            shape: "image",
                            image: strMealThumb,
                            type: "meal"
                        })
                        newEdges.push({
                            id:`${id}_${strMeal}`,
                            from: id,
                            to: strMeal,
                            type: "area"
                        })
                    }

                    let updatedNodes = _.uniqWith(this.state.graph.nodes.concat(newNodes), _.isEqual);
                    let updatedEdges = _.uniqWith(this.state.graph.edges.concat(newEdges), _.isEqual);
                    this.setState({
                        graph: {
                            nodes: updatedNodes,
                            edges: updatedEdges
                        }
                    });
                })
                break;
            }
            case "meal": {
                getMealDetails(label).then((response) => {
                    const {meals} = response.data;
                    const newNodes = [];
                    const newEdges = [];
                    for (const meal of meals) {
                        for(let i=1; i <= 20; i++){
                            const name = meal[`strIngredient${i}`];
                            if(name === "" || name == null) continue;
                            const quantity = meal[`strMeasure${i}`]; // TODO Forse servirà?
                            newNodes.push({
                                id: name,
                                label: name,
                                shape: "image",
                                image: encodeURI(`https://www.themealdb.com/images/ingredients/${name}.png`),
                                type: "ingredient"
                            })
                            newEdges.push({
                                id:`${id}_${name}`,
                                from: id,
                                to: name,
                                type: "meal"
                            })
                        }
                    }

                    let updatedNodes = _.uniqWith(this.state.graph.nodes.concat(newNodes), _.isEqual);
                    let updatedEdges = _.uniqWith(this.state.graph.edges.concat(newEdges), _.isEqual);
                    this.setState({
                        graph: {
                            nodes: updatedNodes,
                            edges: updatedEdges
                        }
                    });
                })
                break;
            }
        }
    }

    render() {
        return (
            <div>
                <VisNetworkReactComponent
                    data={this.state.graph}
                    options={options}
                    events={this.events}
                    getNetwork={this.getNetwork}
                    style={{height: "100vh"}}
                />
            </div>
        )
    }

    getNetwork(network) {this.setState({network})}

    getCountryCode(area){
        switch (area) {
            case "American":{
                return "us";
            }
            case "British":{
                return "gb";
            }
            case "Canadian":{
                return "ca";
            }
            case "Chinese":{
                return "cn";
            }
            case "Dutch":{
                return "de";
            }
            case "Egyptian":{
                return "eg";
            }
            case "French":{
                return "fr";
            }
            case "Greek":{
                return "gr";
            }
            case "Indian":{
                return "in";
            }
            case "Irish":{
                return "ie";
            }
            case "Italian":{
                return "it";
            }
            case "Jamaican":{
                return "jm";
            }
            case "Japanese":{
                return "jp";
            }
            case "Kenyan":{
                return "ke";
            }
            case "Malaysian":{
                return "my";
            }
            case "Mexican":{
                return "mx";
            }
            case "Moroccan":{
                return "ma";
            }
            case "Russian":{
                return "ru";
            }
            case "Spanish":{
                return "es";
            }
            case "Thai":{
                return "th";
            }
            case "Tunisian":{
                return "tn";
            }
            case "Turkish":{
                return "tr";
            }
            case "Vietnamese":{
                return "vn";
            }
        }
    }
}

export default IngredientsChart;