import React, { Component } from "react";
import axios from "axios";
import AddItem from "./AddItem";
import Items from "./Items";
import _ from "lodash";
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tasksArray: [],
      maxOrderNo: -1,
    };
  }

  componentDidMount() {
    axios
      .get("/items")
      .then((response) => {
        const tasksArray = response.data;
        this.setState({
          tasksArray,
          loading: false,
          maxOrderNo: !_.isEmpty(tasksArray)
            ? _.maxBy(tasksArray, "itemOrderNo").itemOrderNo
            : -1,
        });
      })
      .catch((error) => {});
  }

  handleCheckbox = (taskId) => {
    let doneTask = this.state.tasksArray.filter((task) => {
      return task._id === taskId;
    });
    doneTask[0].itemDone
      ? _.set(doneTask[0], "itemDone", false)
      : _.set(doneTask[0], "itemDone", true);
    axios
      .put("/items/update/" + taskId, doneTask[0])
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          this.updateItem(response.data);
        }
      })
      .catch((error) => {
        this.handleErrors(error.response.data);
      });
  };

  addItem = (data) => {
    let { tasksArray } = this.state;
    tasksArray.push(data);
    this.setState({
      tasksArray,
      maxOrderNo: this.state.maxOrderNo + 1,
    });
  };

  updateItem = (data) => {
    let newTasksArray = this.state.tasksArray.filter((task) => {
      return task._id !== data._id;
    });
    newTasksArray.push(data);
    this.setState({ tasksArray: newTasksArray });
  };

  onSubmit = (data) => {
    _.set(data, "itemOrderNo", this.state.maxOrderNo + 1);
    axios
      .post("/items/add", data)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          this.addItem(response.data);
        }
      })
      .catch((error) => {
        this.handleErrors(error.response.data);
      });
  };

  handleOnDelete = (taskId) => {
    axios
      .delete("/items/" + taskId)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          let { tasksArray } = this.state;
          const newTasksArray = tasksArray.filter(
            (task) => task._id !== taskId
          );
          this.setState({
            tasksArray: newTasksArray,
            maxOrderNo: !_.isEmpty(newTasksArray)
              ? _.maxBy(newTasksArray, "itemOrderNo").itemOrderNo
              : -1,
          });
        }
      })
      .catch((error) => {
        this.handleErrors(error.response.data);
      });
  };

  handleErrors = (error) => {
    var msg = Object.values(error).map(function (value) {
      return value;
    });
    return window.alert(msg);
  };

  render() {
    console.log("landing orderno", this.state.maxOrderNo);
    return (
      <div className="container">
        {this.state.loading ? (
          "loading ..."
        ) : (
          <div className="row">
            <div className="col">
              <AddItem
                onSubmit={this.onSubmit}
                maxOrderNo={this.state.maxOrderNo}
              />
            </div>
            <div className="col">
              {" "}
              <Items
                tasksArray={this.state.tasksArray}
                deleteItem={this.deleteItem}
                handleCheckbox={this.handleCheckbox}
                onDelete={this.handleOnDelete}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Landing;
