import React, { Component } from "react";
import ComboBoxComponent from "./ComboBox";
import ChartComponent from "./ChartComponent";
import moment from 'moment';

const endpoint = "http://tl-macxcode09p.thetrainline.com:3000"
// const endpoint = "http://localhost:3000"
const dateFormat = "DD ddd MMM"

class AppComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            data: {},
            users: [],
            schemas: [],
            selectedPeople: [],
            selectedSchemas: [],
            categories: [],
            selectedCategories: [],
            greatestYWeveSeen: 0,
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

    requestCategories = () => {
        var context = this;
        fetch(`${endpoint}/categories`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {

                var categories = [{
                    id: "All",
                    name: "All"
                }];
                json.rows.map(row => {
                    categories.push({ id: row.category, name: row.category })
                })

                context.setState({ categories: categories })
                console.dir(categories)
                console.log("got categories")
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
        this.requestCategories();
    }

    peopleComboBoxChange = (selectedPeople) => {
        console.log(`callback selectedPerson invoked with ${JSON.stringify(selectedPeople)}`);
        this.setState({ selectedPeople: selectedPeople })
    }

    categoryComboBoxChange = (selectedCategories) => {
        console.log(`callback selectedCategories invoked with ${JSON.stringify(selectedCategories)}`);
        this.setState({ selectedCategories: selectedCategories })
    }

    processData = () => {
        var lines = [];

        if (this.state.selectedPeople.length == 0) {
            lines.push(this.createLineForAllPeople())
        } else {

            this.state.selectedPeople.map(person => {
                lines.push(this.createLineForIndividualPerson(person.id))
            })
        }

        return lines
    }

    createLineForAllPeople = () => {
        var formattedData = {}; // date -> { number of records / total duration}
        var filtered = this.state.data

        if (this.state.selectedCategories.length > 0) {
            filtered = filtered.filter((row) => this.state.selectedCategories.map((c) => c.id).includes(row.category))
        }
        // creating the totals
        filtered.map(row => {

            if (this.state.selectedSchemas.includes(row.schema)
                || this.state.selectedSchemas.length == 0) {
                // console.log("iterating through a row " + row.day)
                if (formattedData[row.day] != undefined) {
                    var record = formattedData[row.day];
                    record.count++;
                    record.duration += row.duration;
                    formattedData[row.day] = record
                } else {
                    var record = { "count": 1, "duration": row.duration }
                    formattedData[row.day] = record
                }
            }
        })

      // format data to render in the chart
      var line = []
      for (var key in formattedData) {
        var record = formattedData[key]
        let average = Math.round(record.duration / record.count)
        let formattedDate = moment(new Date(key)).format(dateFormat).toString()
        line.push({x : formattedDate, y: average, person: "all"})

      }
      return line
    }

    createLineForIndividualPerson = (user_id) => {
        var formattedData = {}; // date -> { number of records / total duration}

        var filtered = this.state.data

        if (this.state.selectedCategories.length > 0) {
            filtered = filtered.filter((row) => this.state.selectedCategories.map((c) => c.id).includes(row.category))
        }
        // creating the totals
        filtered.map(row => {
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
        let formattedDate = moment(new Date(key)).format(dateFormat).toString()
        line.push({x : formattedDate, y: average, person: user_id})
      }
      return line
    }

    updateGreatestYWeveSeen = (lines) => {
      let currentGreatestY = this.state.greatestYWeveSeen
      lines.map(line => {
        line.map(dot => {
          if (dot.y > currentGreatestY ) {
            currentGreatestY = dot.y
          }
        })
      })

      if (currentGreatestY != this.state.greatestYWeveSeen) {
        this.setState({greatestYWeveSeen: currentGreatestY})
      }

    }

    schemaComboBoxChange = (selectedSchema) => {
        console.log("callback selectedSchema invoked");
        console.log(selectedSchema)

        var formatted = []
        selectedSchema.map(item => {
            formatted.push(item.id)
        })
        this.setState({ selectedSchemas: formatted })
    }

    render() {

        console.log("render data " + this.state.data.length)
        var content = <p className="animate-spin-slow flex justify-center items-center">
            <span className="material-icons text-5xl">sync</span>
        </p>

        if (this.state.data.length > 0) {
            var processedData = this.processData()
            this.updateGreatestYWeveSeen(processedData)
            content = <div className="flex justify-center items-center">
                <ChartComponent
                  data={processedData}
                  max_y={this.state.greatestYWeveSeen}
                />
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

        var categorySelector = <p></p>
        if (this.state.categories.length > 0) {
            categorySelector = <ComboBoxComponent
                elements={this.state.categories}
                title="Category"
                notifyComboBoxChanged={this.categoryComboBoxChange}
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
                    {
                        categorySelector
                    }
                </div>
                <div className="p-2 mt-4 border-4 border-dashed border-gray-200 rounded-lg h-2/3">
                    {
                        content
                    }
                </div>
            </div>
        )
    }
}

export default AppComponent;
