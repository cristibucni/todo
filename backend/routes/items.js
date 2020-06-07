const router = require("express").Router();
let Item = require("../models/item");

router.route("/").get((req, res) => {
  Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const itemName = req.body.itemName;
  const itemOrderNo = req.body.itemOrderNo;
  const itemDone = req.body.itemDone;

  const newItem = new Item({ itemName, itemOrderNo, itemDone });

  newItem
    .save()
    .then(() => res.json("Item added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Item.findById(req.params.id)
    .then((item) => res.json(item))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json("Item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      item.itemName = req.body.itemName;
      item.itemOrderNo = req.body.itemOrderNo;
      item.itemDone = req.body.itemDone;

      Item.save()
        .then(() => res.json("Item updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
