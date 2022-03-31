import React, { Component } from "react";
import ComboBoxComponent from "./ComboBox";
import ChartComponent from "./ChartComponent";

// const endpoint = "http://tl-macxcode09p.thetrainline.com:3001"
const endpoint = "http://localhost:3000"

class AppComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            data: {},
            users: [],
            schemas: [],
            selectedPeople: [],
            selectedSchemas: []
        }
    }

    requestData = () => {
        var context = this;
        fetch(`${endpoint}/builds`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                context.setState({ data: json.rows })
                console.log("got data")
            })
            .catch((error) => {
                console.log(error);
            })
    }

    requestUserIDs = () => {
        var context = this;
        fetch(`${endpoint}/user_id`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {

                var people = [{
                    id: "All",
                    name: "All"
                }];
                json.rows.map(row => {
                    people.push({ id: row.user_id, name: row.user_id })
                })

                context.setState({ users: people })
                console.log("got user ids")
            })
            .catch((error) => {
                console.log(error);
            })
    }

    requestSchemas = () => {
        var context = this;
        fetch(`${endpoint}/schemas`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {

                var schemas = [{
                    id: "All",
                    name: "All"
                }];
                json.rows.map(row => {
                    schemas.push({ id: row.schema, name: row.schema })
                })

                context.setState({ schemas: schemas })
                console.log("got schemas")
            })
            .catch((error) => {
                console.log(error);
            })
    }

    componentDidMount = () => {
        this.requestData();
        this.requestUserIDs();
        this.requestSchemas();
    }

    peopleComboBoxChange = (selectedPeople) => {
        console.log(`callback selectedPerson invoked with ${JSON.stringify(selectedPeople)}`);
        this.setState({selectedPeople : selectedPeople})
    }

    processData = () => {
        var lines = [];

        if(this.state.selectedPeople.length == 0) {
          lines.push(this.createLineForAllPeople())
        } else {

          this.state.selectedPeople.map(person => {
            lines.push(this.createLineForIndividualPerson(person.id))
          })
        }

        return lines
    }

    createLineForAllPeople = () => {
      var formattedData = {} ; // date -> { number of records / total duration}

      // creating the totals
      this.state.data.map(row=> {

        if (this.state.selectedSchemas.includes(row.schema)
              || this.state.selectedSchemas.length == 0) {
          // console.log("iterating through a row " + row.day)
          if(formattedData[row.day] != undefined) {
            var record = formattedData[row.day];
            record.count ++;
            record.duration += row.duration;
            formattedData[row.day] = record
          } else {
            var record = {"count": 1, "duration": row.duration}
            formattedData[row.day] = record
          }
        }
      })


      // format data to render in the chart
      var line = []
      for (var key in formattedData) {
        var record = formattedData[key]
        let average = Math.round(record.duration / record.count)
        line.push({x : key, y: average, label: "all"})
      }
      return line
    }

    createLineForIndividualPerson = (user_id) => {
      var formattedData = {} ; // date -> { number of records / total duration}

      // creating the totals
      this.state.data.map(row=> {

        // does the user id match
        if (user_id === row.user_id) {
          // does this match the schema
          if (this.state.selectedSchemas.includes(row.schema)
                || this.state.selectedSchemas.length == 0) {
            // console.log("iterating through a row " + row.day)
            if(formattedData[row.day] != undefined) {
              var record = formattedData[row.day];
              record.count ++;
              record.duration += row.duration;
              formattedData[row.day] = record
            } else {
              var record = {"count": 1, "duration": row.duration}
              formattedData[row.day] = record
            } // end if for record already exists
          } // end if for schema
        }// end if for user_id
      })


      // format data to render in the chart
      var line = []
      for (var key in formattedData) {
        var record = formattedData[key]
        let average = Math.round(record.duration / record.count)
        line.push({x : key, y: average, label: user_id})
      }
      return line
    }

    schemaComboBoxChange = (selectedSchema) => {
        console.log("callback selectedSchema invoked");
        console.log(selectedSchema)

        var formatted = []
        selectedSchema.map(item => {
          formatted.push(item.id)
        })
        this.setState({selectedSchemas : formatted})
    }

    render() {

        console.log("render data " + this.state.data.length)
        var content = <p className="animate-spin-slow flex justify-center items-center h-96">
            <span className="material-icons text-5xl">sync</span>
        </p>

        if (this.state.data.length > 0) {
            var processedData = this.processData()
            content = <div className="flex justify-center items-center h-96">
                <ChartComponent data={processedData}/>
            </div>
        }


        var peopleSelector = <p></p>
        if (this.state.users.length > 0) {
            peopleSelector = <ComboBoxComponent
                elements={this.state.users}
                title="Person"
                notifyComboBoxChanged={this.peopleComboBoxChange}
                multiSelect={true}
            />
        }

        var schemaSelector = <p></p>
        if (this.state.schemas.length > 0) {
            schemaSelector = <ComboBoxComponent
                elements={this.state.schemas}
                title="Schemas"
                notifyComboBoxChanged={this.schemaComboBoxChange}
                multiSelect={true}
            />
        }

        return (
            <div>
                <div className="flex grow flex-row">
                    {
                        peopleSelector
                    }
                    {
                        schemaSelector
                    }
                </div>
                <div className="mt-4 border-4 border-dashed border-gray-200 rounded-lg h-96">
                    {
                        content
                    }
                </div>
            </div>
        )
    }
}

export default AppComponent;
