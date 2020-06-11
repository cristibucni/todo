const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = require("./keys").mongoURI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const itemsRouter = require("./routes/items");
const completedItemsRouter = require("./routes/completedItems");

app.use("/items", itemsRouter);
app.use("/completedItems", completedItemsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
