import React, { Component } from "react";
class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      itemDone: false,
    };
  }

  componentDidMount() {
    this.setState({ hasUpdated: false });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnKeyPress = (e) => {
    console.log(e);
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
            className="input"
            placeholder="Task name"
            onChange={this.onChange}
            value={this.state.itemName}
            onKeyPress={this.handleOnKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default AddItem;
