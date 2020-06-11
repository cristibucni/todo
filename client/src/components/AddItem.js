import React, { Component } from "react";
class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errorMessage: "You already have this task",
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.onSubmit(this.state);

      this.setState({ name: "" });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="tasks-header">Add to-do</div>
        <br />
        <div>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Task name"
            onChange={this.onChange}
            value={this.state.name}
            onKeyPress={this.handleOnKeyPress}
            autoComplete="off"
          />
          {this.props.duplicateTitle && this.state.errorMessage}
        </div>
      </div>
    );
  }
}

export default AddItem;
