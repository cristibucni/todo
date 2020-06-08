import React, { Component } from "react";
import "./Landing.css";
class Item extends Component {
  render() {
    const additionalClassName = this.props.checked ? "line-through" : "";
    return (
      <li key={this.props.data._id} className="item">
        <input
          type="checkbox"
          id={this.props.index}
          name="name"
          className="task-checkbox"
          onChange={() => this.props.handleCheckbox(this.props.data._id)}
          checked={this.props.checked}
        />
        <span className={"item-name " + additionalClassName}>
          {this.props.data.itemName}
        </span>
        <button
          className="task-delete"
          onClick={() => this.props.onDelete(this.props.data._id)}
        >
          <i className="fa fa-remove" />
        </button>
      </li>
    );
  }
}

export default Item;
