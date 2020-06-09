import React, { Component } from "react";
import axios from "axios";
import AddItem from "./AddItem";
import _ from "lodash";
import { SortableItem, swapArrayPositions } from "react-sort-list";
import Item from "./Item";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 30% auto;
  border-color: #1b1b1f;
`;
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tasksArray: [],
      duplicateTitle: false,
    };
  }

  componentDidMount() {
    axios
      .get("/items")
      .then((response) => {
        const tasksArray = response.data;
        const todos = tasksArray.map((task, index) => {
          return {
            id: index + 1,
            title: task.itemName,
          };
        });
        this.setState({
          tasksArray,
          loading: false,
          todos,
        });
      })
      .catch((error) => {});
  }

  swap = (dragIndex, dropIndex) => {
    let swappedTodo = swapArrayPositions(
      this.state.todos,
      dragIndex,
      dropIndex
    );
    this.setState(
      {
        todos: swappedTodo,
      },
      () => {
        let newTasksArray = [];
        this.state.todos.forEach((todo) => {
          this.state.tasksArray.forEach((task) => {
            if (todo.title === task.itemName) {
              newTasksArray.push(task);
            }
          });
        });
        this.updateWholeArray(newTasksArray);
      }
    );
  };

  handleCheckbox = (taskId) => {
    let doneTask = this.state.tasksArray.filter((task) => {
      return task._id === taskId;
    });
    const newTasksArray = this.state.tasksArray.filter((task) => {
      return task._id !== taskId;
    });
    if (doneTask[0].itemDone) {
      _.set(doneTask[0], "itemDone", false);
      newTasksArray.unshift(doneTask[0]);
    } else {
      _.set(doneTask[0], "itemDone", true);
      newTasksArray.push(doneTask[0]);
    }

    this.updateWholeArray(newTasksArray);
  };

  updateWholeArray = (newTasksArray) => {
    axios
      .delete("/items/")
      .then((response) => {
        axios
          .post("/items/", newTasksArray)
          .then((response) => {
            const tasksArray = response.data;
            this.setState({ tasksArray });
          })
          .catch((error) => {
            this.handleErrors(error.response.data);
          });
      })
      .catch((error) => {});
  };

  addItem = (data) => {
    let { tasksArray } = this.state;
    tasksArray.push(data);
    const todos = tasksArray.map((task, index) => {
      return {
        id: index + 1,
        title: task.itemName,
      };
    });
    this.setState({
      tasksArray,
      todos,
      duplicateTitle: false,
    });
  };

  updateItem = (data) => {
    let newTasksArray = this.state.tasksArray;
    _.set(
      newTasksArray[_.findIndex(this.state.tasksArray, ["_id", data._id])],
      "itemName",
      data.itemName
    );
    const todos = newTasksArray.map((task, index) => {
      return {
        id: index + 1,
        title: task.itemName,
      };
    });
    this.setState({ tasksArray: newTasksArray, todos, duplicateTitle: false });
  };

  onSubmit = (data) => {
    let flag = false;
    this.state.tasksArray.forEach((task) => {
      if (task.itemName === data.itemName) {
        flag = true;
      }
    });
    if (!flag) {
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
    } else {
      this.setState({ duplicateTitle: true });
    }
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
          const todos = newTasksArray.map((task, index) => {
            return {
              id: index + 1,
              title: task.itemName,
            };
          });
          this.setState({
            tasksArray: newTasksArray,
            todos,
          });
        }
      })
      .catch((error) => {
        this.handleErrors(error.response.data);
      });
  };

  onEditDone = (newTaskData) => {
    let flag = false;
    this.state.tasksArray.forEach((task) => {
      if (task.itemName === newTaskData.itemName) {
        flag = true;
      }
    });
    if (!flag) {
      axios
        .put("/items/update/" + newTaskData._id, newTaskData)
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            this.updateItem(response.data);
          }
        })
        .catch((error) => {
          this.handleErrors(error.response.data);
        });
    } else {
      this.setState({ duplicateTitle: true });
    }
  };

  handleErrors = (error) => {
    var msg = Object.values(error).map(function (value) {
      return value;
    });
    return window.alert(msg);
  };

  renderItems = () => {
    const { tasksArray } = this.state;
    return _.isEmpty(tasksArray) ? (
      <img src="nuttin.png" alt="..." className="nuttin" />
    ) : (
      tasksArray.map((item, index) => {
        return (
          <SortableItem
            items={this.state.todos}
            id={this.state.todos[index].id}
            key={this.state.todos[index].id}
            swap={this.swap}
          >
            <Item
              onDelete={this.handleOnDelete}
              data={item}
              key={item._id}
              handleCheckbox={this.handleCheckbox}
              checked={item.itemDone}
              onEditDone={this.onEditDone}
            />
          </SortableItem>
        );
      })
    );
  };

  render() {
    return this.state.loading ? (
      <div className="sweet-loading">
        <RingLoader
          css={override}
          size={60}
          color={"#1b1b1f"}
          margin={2}
          loading={this.state.loading}
        />
        {console.log("( ͡° ͜ʖ ͡°) I see you.")}
      </div>
    ) : (
      <div className="container">
        <div className="row">
          <div className="col">
            <AddItem
              onSubmit={this.onSubmit}
              duplicateTitle={this.state.duplicateTitle}
            />
          </div>
          <div className="col">
            {" "}
            <div className="tasks-header">List of tasks</div>
            {this.renderItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
