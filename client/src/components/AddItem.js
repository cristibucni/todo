import React, { Component } from "react";
class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      itemDone: false,
      errorMessage: "No duplicate names kind sir.",
    };
  }

  componentDidMount() {
    this.setState({ hasUpdated: false });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.onSubmit(this.state);

      this.setState({ itemName: "" });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="tasks-header">Add task</div>
        <br />
        <div>
          <input
            type="text"
            name="itemName"
            className={"input"}
            placeholder="Task name"
            onChange={this.onChange}
            value={this.state.itemName}
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
