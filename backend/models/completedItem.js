const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const completedItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompletedItem = mongoose.model("CompletedItem", completedItemSchema);

module.exports = CompletedItem;
