import React, { Component } from "react";
import "./Landing.css";
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      itemName: this.props.data.itemName,
      itemDone: this.props.checked,
      _id: this.props.data._id,
    };
  }

  onClick = () => {
    this.setState({
      edit: !this.state.edit,
      itemName: this.props.data.itemName,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onKeyPress = (e) => {
    if (e.key === "Enter") {
      this.setState({ edit: false }, () => {
        if (!this.state.edit) {
          const newTaskData = {
            itemName: this.state.itemName,
            itemDone: this.state.itemDone,
            _id: this.state._id,
          };
          this.props.onEditDone(newTaskData);
        }
      });
    }
  };

  render() {
    const additionalClassName = this.props.checked ? "line-through" : "";
    const additionalItemClassName = this.state.edit ? "border-focus" : "";
    return (
      <li
        key={this.props.data._id}
        className={"item " + additionalItemClassName}
      >
        <input
          type="checkbox"
          id={this.props.index}
          name="name"
          className="task-checkbox"
          onChange={() => this.props.handleCheckbox(this.props.data._id)}
          checked={this.props.checked}
        />
        {this.state.edit ? (
          <input
            id="input"
            type="text"
            value={this.state.itemName}
            onChange={this.onChange}
            name="itemName"
            onKeyPress={this.onKeyPress}
            className="name-input"
          />
        ) : (
          <span className={"item-name " + additionalClassName}>
            {this.props.data.itemName}
          </span>
        )}

        <button
          className="task-button"
          onClick={() => this.props.onDelete(this.props.data._id)}
        >
          <i className="fa fa-remove" />
        </button>
        <button className="task-button" onClick={this.onClick}>
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
      </li>
    );
  }
}

export default Item;
