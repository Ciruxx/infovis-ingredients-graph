import React, {Component} from 'react'
import VisNetworkReactComponent from "vis-network-react";
import {getAreas, getMealsByArea, getMealDetails} from '../../../data/TheMealDB'
import Drawer from "../../drawer";
import Typography from "@material-ui/core/Typography";
import YouTube from 'react-youtube';
import * as _ from 'lodash';

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