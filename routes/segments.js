const auth = require("../middleware/auth");
const { Segment, validate } = require("../models/segment");
const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  // const filters = JSON.parse(req.query.filter);
  const segments = await Segment.find().select("-__v").sort("name");
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: segments.length,
  });
  res.send(segments.slice(req.range.first, req.range.last + 1));
});
router.get("/all", async (req, res) => {
  const segments = await Segment.find().select("-__v").sort("name");

  res.send(segments);
});
router.get("/:id", validateObjectId, async (req, res) => {
  const segment = await Segment.findById(req.params.id).select("-__v");

  if (!segment)
    return res.status(404).send("The segment with the given ID was not found.");

  res.send(segment);
});
router.post("/", [auth, admin], async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const name = { en: req.body.name, de: req.body.name_de };
  let segment = new Segment({ name: name, description: req.body.description });
  segment = await segment.save();

  res.send(segment);
});
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate({
    name: req.body.name.en,
    name_de: req.body.name.de,
    description: req.body.description,
  });
  if (error) return res.status(400).send(error.details[0].message);

  const segment = await Segment.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description },
    {
      new: true,
    }
  );

  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  res.send(segment);
});
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const segment = await Segment.findByIdAndRemove(req.params.id);

  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  res.send(segment);
});
module.exports = router;
