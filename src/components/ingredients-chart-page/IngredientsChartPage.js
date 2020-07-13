import React, {Component} from 'react'

import IngredientsChart from './charts/IngredientsChart'
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';

class IngredientsChartPage extends Component {
    render() {
        return (
            <div>
                <Container maxWidth="lg">
                    <br/>
                    <br/>
                    <Typography variant="h2" color="textPrimary" align="center">
                        Ingredients <strong>graph</strong>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" align="center">
                        MC² Group
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" align="center">
                        One click for information, two click to expand and right click to delete..easy 😁
                    </Typography>
                    <br/>
                    <br/>
                    <Paper elevation={3} style={{height: "100vh"}}>
                        <IngredientsChart/>
                    </Paper>
                    <br/>
                    <br/>
                </Container>
            </div>
        )
    }
}

export default IngredientsChartPage