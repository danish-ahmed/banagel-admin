const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Category, validate } = require("../models/category");
const express = require("express");
const { Segment } = require("../models/segment");
const router = express.Router();

router.get("/", async (req, res) => {
  const category = await Category.find().select("-__v").sort("name");
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: category.length,
  });
  res.send(category.slice(req.range.first, req.range.last + 1));
});
router.get("/all", async (req, res) => {
  const category = await Category.find().select("-__v").sort("name");
  // res.range({
  //   first: req.range.first,
  //   last: req.range.last,
  //   length: category.length,
  // });
  res.send(category);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const segment = await Segment.findById(req.body.segment);
  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  let category = new Category({
    name: { en: req.body.name, de: req.body.name_de },
    segment: segment,
  });
  category = await category.save();

  res.send(category);
});
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  // const { error } = validate(req.body);
  const { error } = validate({
    name: req.body.name.en,
    name_de: req.body.name.de,
    segment: req.body.segment,
  });
  if (error) return res.status(400).send(error.details[0].message);

  const segment = await Segment.findById(req.body.segment);
  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, segment },

    {
      new: true,
    }
  );

  if (!category)
    return res
      .status(404)
      .send("The Category with the given ID was not found.");

  res.send(category);
});
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});
module.exports = router;
