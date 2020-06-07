const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const itemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    itemOrderNo: {
      type: Number,
    },
    itemDone: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
