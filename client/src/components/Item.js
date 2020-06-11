import React, { Component } from "react";
import "./Landing.css";
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      name: this.props.data.name,
      itemDone: this.props.checked,
      _id: this.props.data._id,
    };
  }

  onClick = () => {
    this.setState({
      edit: !this.state.edit,
      name: this.props.data.name,
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
            name: this.state.name,
            _id: this.state._id,
          };
          this.props.onEditDone(newTaskData);
        }
      });
    }
  };

  render() {
    const additionalClassName = this.props.checked ? "item-done" : "";
    const additionalItemClassName = this.state.edit ? "border-focus" : "";
    return (
      <li
        key={this.props.data._id}
        className={"item " + additionalItemClassName + additionalClassName}
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
            value={this.state.name}
            onChange={this.onChange}
            name="name"
            onKeyPress={this.onKeyPress}
            className="name-input"
            autoComplete="off"
          />
        ) : (
          <span className={"item-name " + additionalClassName}>
            {this.props.data.name}
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
