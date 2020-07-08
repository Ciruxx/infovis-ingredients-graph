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

        this.state = {
            network: null,
            graph: {
                nodes: [],
                edges: []
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
}

export default IngredientsChart;