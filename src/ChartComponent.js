import React, { Component } from "react";
import ComboBoxComponent from "./ComboBox";
import { VictoryLine, VictoryChart, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer, VictoryLegend } from "victory"

class ChartComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {

        }
        console.log(JSON.stringify(this.props.data))
    }

  getSampleData = () => {
      return  [
        [
          { x: "monday", y: this.getRandomInt(50) },
          { x: "tuesday", y: this.getRandomInt(50) },
          { x: "wednesday", y: this.getRandomInt(50) },
          { x: "thursday", y: this.getRandomInt(50) },
          { x: "friday", y: this.getRandomInt(50), label: "Bob" }
        ],
        [
          { x: "monday", y: this.getRandomInt(50) },
          { x: "tuesday", y: this.getRandomInt(50) },
          { x: "wednesday", y: this.getRandomInt(50) },
          { x: "friday", y: this.getRandomInt(50), label: "Claire" }
        ],
        [
          { x: "monday", y: this.getRandomInt(50) },
          { x: "tuesday", y: this.getRandomInt(50) },
          { x: "wednesday", y: this.getRandomInt(50) },
          { x: "thursday", y: this.getRandomInt(50) },
          { x: "friday", y: this.getRandomInt(50), label: "Danielle" }
        ],
        [
          { x: "monday", y: this.getRandomInt(50) },
          { x: "tuesday", y: this.getRandomInt(50) },
          { x: "wednesday", y: this.getRandomInt(50) },
          { x: "thursday", y: this.getRandomInt(50) },
          { x: "friday", y: this.getRandomInt(50), label: "Eloise" }
        ]

      ]
    }

   getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    }

    render() {

      var colours = ["#D8334A", "#ED5565", "#FC6E51", "#FFCE54", "#A0D468", "#2ECC71", "#48CFAD", "#A0CECB",
                      "#4FC1E9", "#5D9CEC", "#AC92EC", "#8067B7", "#EC87C0", "#BAA286", "#8E8271"];
      let greyColour = "#AAB2BD";

      let allocatedColourPerPerson = {}
      var legendData = []
      this.props.data.map(line => {
        var selectedColour = greyColour
        if (colours.length > 0) {
          let index = this.getRandomInt(colours.length)
          selectedColour = colours[index]
          colours.splice(index, 1)
        }

        allocatedColourPerPerson[line[0].person] = selectedColour
        legendData.push({ name: line[0].person, symbol: { fill: selectedColour } })
      })

        return (
            <div>
            <VictoryChart
            height={300}
            width={700}
            padding={{ left: 200 }}
            containerComponent={
              <VictoryVoronoiContainer voronoiDimension="x"
              labels={({ datum }) => `y: ${datum.y}`}
              labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
              />
            }
          >

          <VictoryLegend x={0} y={50}
                title="Legend"
                centerTitle
                orientation="vertical"
                gutter={20}
                style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
                data={legendData}
              />
              {
                  this.props.data.map((line, index) => {

                    return <VictoryLine
                      key={index}
                      style={{
                        data: { stroke: allocatedColourPerPerson[line[0].person], strokeWidth: 2, strokeLinecap: "round" },
                        labels: {fill: allocatedColourPerPerson[line[0].person]}
                      }}
                      // interpolation="natural"
                      data={line}
                      // labelComponent={<VictoryLabel dx={10} dy={15} renderInPortal />}
                      animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 }
                      }}
                    />
                  })

              }
              </VictoryChart>
            </div>
        )
    }
}

export default ChartComponent;
