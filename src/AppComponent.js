import React, { Component } from "react";
import ComboBoxComponent from "./ComboBox";
import ChartComponent from "./ChartComponent";

class AppComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            data: {},
            users: []
        }
    }

    requestData = () => {
        var context = this;
        fetch("http://tl-macxcode09p.thetrainline.com:3001/builds")
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
        fetch("http://tl-macxcode09p.thetrainline.com:3001/user_id")
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

    componentDidMount = () => {
        this.requestData();
        this.requestUserIDs();
    }

    peopleComboBoxChange = (selectedPerson) => {
        console.log("callback selectedPerson invoked");
    }

    processData = () => {
      // TODO 1 : using this.state.data filter to get the correct data to display.
      
      var row = {[
        { x: "Monday 26th February", y: 200 }
      ]}
      console.log(data)
      return data
    }

    render() {
        var processedData = this.processData()
        console.log("render data " + this.state.data.length)
        var content = <p className="animate-spin-slow flex justify-center items-center h-96">
            <span className="material-icons text-5xl">sync</span>
        </p>

        if (this.state.data.length > 0) {
            content = <p className="flex justify-center items-center h-96">
                <span className="material-icons text-5xl">face</span>
            </p>
        }

        var peopleSelector = <p></p>
        if (this.state.users.length > 0) {
            peopleSelector = <ComboBoxComponent
                people={this.state.users}
                notifyComboBoxChanged={this.peopleComboBoxChange}
            />
        }

        // TODO 2: render selection controls and update this.state with what was selected.
        /*
          1. toggle button Render this.state.showEveryone (true/false)
          2. this.state.selectedPeople = ["user_id", "user_id"]
          2. drop down for schema - this.state.selectedSchema ("string")
          3. toggle to include categories? - "clean"/"noop"/"incremental" ?
        */

        return (
            <div>
                {
                    content
                }
                <ChartComponent data={processedData}/>
                {
                    peopleSelector
                }
            </div>
        )
    }
}

export default AppComponent;
