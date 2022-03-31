import React, { Component } from "react";
import ComboBoxComponent from "./ComboBox";
import { VictoryLine } from "victory"

class ChartComponent extends Component {
    constructor(props) {
        super();

        this.props = props;

      console.log(JSON.stringify(this.props.data))
    }



    render() {

        return (
            <div>I AM A CHART</div>
        )
    }
}

export default ChartComponent;
