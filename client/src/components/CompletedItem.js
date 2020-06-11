import React, { Component } from "react";
import "./Landing.css";
class CompletedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.data.name,
      _id: this.props.data._id,
    };
  }

  render() {
    return (
      <li key={this.props.data._id} className={"item "}>
        <i class="fa fa-check" aria-hidden="true"></i>
        <span className={"item-name "}>{this.props.data.name}</span>
      </li>
    );
  }
}

export default CompletedItem;
