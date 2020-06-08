import React, { Component } from "react";
import _ from "lodash";
import "./Landing.css";
import Item from "./Item";
class Items extends Component {
  renderItems = () => {
    const { tasksArray } = this.props;
    tasksArray.sort((a, b) => (a.itemOrderNo > b.itemOrderNo ? 1 : -1));
    return _.isEmpty(tasksArray)
      ? "None"
      : tasksArray.map((item) => {
          console.log("item", item);
          return (
            <Item
              onDelete={this.props.onDelete}
              data={item}
              key={item._id}
              handleCheckbox={this.props.handleCheckbox}
              checked={item.itemDone}
            />
          );
        });
  };
  render() {
    return (
      <div className="container">
        <div className="tasks-header">List of tasks</div>
        {this.renderItems()}
      </div>
    );
  }
}

export default Items;
