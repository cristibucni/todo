const router = require("express").Router();
let CompletedItem = require("../models/completedItem");

/** @route
 *  @desc
 *  @access
 */
router.route("/").get((req, res) => {
  CompletedItem.find()
    .then((completedItems) => res.json(completedItems))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").delete((req, res) => {
  CompletedItem.deleteMany()
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res) => {
  CompletedItem.insertMany(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;

  const newItem = new CompletedItem({
    name,
  });

  newItem
    .save()
    .then((completedItem) => res.json(completedItem))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  CompletedItem.findById(req.params.id)
    .then((completedItem) => res.json(completedItem))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  CompletedItem.findByIdAndDelete(req.params.id)
    .then(() => res.json("completedItem deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
