import React, { Component } from "react";
import axios from "axios";
import AddItem from "./AddItem";
import _ from "lodash";
import { SortableItem, swapArrayPositions } from "react-sort-list";
import { css } from "@emotion/core";
import Item from "./Item";
import CompletedItem from "./CompletedItem";
import RingLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 10% auto;
  border-color: #1b1b1f;
`;
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tasksArray: [],
      completedTasksArray: [],
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
            title: task.name,
          };
        });
        axios.get("/completedItems").then((response) => {
          const completedTasksArray = response.data;
          this.setState({
            tasksArray,
            completedTasksArray,
            loading: false,
            todos,
          });
        });
      })
      .catch((error) => {});
  }

  onAddNewTask = (data) => {
    let flag = false;
    this.state.tasksArray.forEach((task) => {
      if (task.name === data.name) {
        flag = true;
      }
    });
    if (!flag) {
      axios
        .post("/items/add", data)
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            let { tasksArray } = this.state;
            tasksArray.push(response.data);
            const todos = tasksArray.map((task, index) => {
              return {
                id: index + 1,
                title: task.name,
              };
            });
            this.setState({
              tasksArray,
              todos,
              duplicateTitle: false,
            });
          }
        })
        .catch((error) => {
          this.handleErrors(error.response.data);
        });
    } else {
      this.setState({ duplicateTitle: true });
    }
  };

  onEditTask = (newTaskData) => {
    let flag = false;
    this.state.tasksArray.forEach((task) => {
      if (task.name === newTaskData.name) {
        flag = true;
      }
    });
    if (!flag) {
      let newTasksArray = this.state.tasksArray;
      _.set(
        newTasksArray[
          _.findIndex(this.state.tasksArray, ["_id", newTaskData._id])
        ],
        "name",
        newTaskData.name
      );
      const todos = newTasksArray.map((task, index) => {
        return {
          id: index + 1,
          title: task.name,
        };
      });
      axios
        .put("/items/update/" + newTaskData._id, newTaskData)
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            this.setState({
              tasksArray: newTasksArray,
              todos,
              duplicateTitle: false,
            });
          }
        })
        .catch((error) => {
          this.handleErrors(error.response.data);
        });
    } else {
      this.setState({ duplicateTitle: true });
    }
  };

  handleCheckbox = (taskId) => {
    const doneTask = this.state.tasksArray.filter((task) => {
      return task._id === taskId;
    });
    this.onDeleteTask(taskId);
    this.submitCompletedTask(doneTask[0]);
  };

  onDeleteTask = (taskId) => {
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
              title: task.name,
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

  onSwapTasks = (dragIndex, dropIndex) => {
    let swappedTodo = swapArrayPositions(
      this.state.todos,
      dragIndex,
      dropIndex
    );

    let newTasksArray = [];
    swappedTodo.forEach((todo) => {
      this.state.tasksArray.forEach((task) => {
        if (todo.title === task.name) {
          newTasksArray.push(task);
        }
      });
    });
    this.updateWholeArray(newTasksArray, swappedTodo);
  };

  updateWholeArray = (newTasksArray, todos) => {
    axios
      .delete("/items/")
      .then((response) => {
        axios
          .post("/items/", newTasksArray)
          .then((response) => {
            const tasksArray = response.data;
            this.setState({ tasksArray, todos });
          })
          .catch((error) => {
            this.handleErrors(error.response.data);
          });
      })
      .catch((error) => {});
  };

  onDeleteCompletedTasks = () => {
    axios
      .delete("/completedItems/")
      .then((response) => {
        this.setState({ completedTasksArray: [] });
      })
      .catch((error) => {});
  };

  submitCompletedTask = (taskData) => {
    axios
      .post("/completedItems/add", taskData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          this.updateCompletedArray(response.data);
        }
      })
      .catch((error) => {
        this.handleErrors(error.response.data);
      });
  };

  updateCompletedArray = (taskData) => {
    let newCompletedTasksArray = this.state.completedTasksArray;
    newCompletedTasksArray.push(taskData);
    this.setState({ completedTasksArray: newCompletedTasksArray });
  };

  handleErrors = (error) => {
    var msg = Object.values(error).map(function (value) {
      return value;
    });
    return window.alert(msg);
  };

  renderTasks = () => {
    const { tasksArray } = this.state;
    return _.isEmpty(tasksArray) ? (
      <center>( ͡° ͜ʖ ͡°) I see you.</center>
    ) : (
      tasksArray.map((item, index) => {
        return (
          <SortableItem
            items={this.state.todos}
            id={this.state.todos[index].id}
            key={this.state.todos[index].id}
            swap={this.onSwapTasks}
          >
            <Item
              onDelete={this.onDeleteTask}
              data={item}
              key={item._id}
              handleCheckbox={this.handleCheckbox}
              checked={item.itemDone}
              onEditDone={this.onEditTask}
            />
          </SortableItem>
        );
      })
    );
  };

  renderCompletedTasks = () => {
    const { completedTasksArray } = this.state;
    return _.isEmpty(completedTasksArray) ? (
      <center>
        “Never put off till tomorrow what may be done day after tomorrow just as
        well.”
      </center>
    ) : (
      completedTasksArray.map((item, index) => {
        return <CompletedItem data={item} key={item._id} />;
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
        <div className="col">
          <AddItem
            onSubmit={this.onAddNewTask}
            duplicateTitle={this.state.duplicateTitle}
          />
        </div>
        <div className="col">
          {" "}
          <div className="tasks-header">Tasks</div>
          {this.renderTasks()}
        </div>
        <div className="col">
          {" "}
          <div className="tasks-header">
            Completed tasks{" "}
            <button
              className="remove-all"
              onClick={() => this.onDeleteCompletedTasks()}
            >
              <i className="fa fa-remove" />
            </button>
          </div>
          {this.renderCompletedTasks()}
        </div>
      </div>
    );
  }
}

export default Landing;
