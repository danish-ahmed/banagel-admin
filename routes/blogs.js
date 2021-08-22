const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Blog, validate } = require("../models/blog");
const express = require("express");
const { Segment } = require("../models/segment");
const router = express.Router();

router.get("/", async (req, res) => {
  //   const filters = JSON.parse(req.query.filter);
  const blog = await Blog.find()
    // .where({ ...filters })
    .select("-__v")
    .sort("title");
  res.range({
    first: JSON.parse(req.query.range)[0],
    last: JSON.parse(req.query.range)[1],
    length: blog.length,
  });
  res.send(
    blog.slice(
      JSON.parse(req.query.range)[0],
      JSON.parse(req.query.range)[1] + 1
    )
  );
});
router.get("/all", async (req, res) => {
  const blog = await Blog.find().select("-__v").sort("title");
  // res.range({
  //   first: req.range.first,
  //   last: req.range.last,
  //   length: category.length,
  // });
  res.send(blog);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate({
    name: req.body.name.en,
    segment: req.body.segment,
    description: req.body.description,
  });
  if (error) return res.status(400).send(error.details[0].message);

  const segment = await Segment.findById(req.body.segment);
  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  let blog = new Blog({
    title: req.body.title,
    segment: segment,
    description: req.body.description,
  });
  blog = await blog.save();

  res.send(blog);
});
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate({
    title: req.body.title,
    segment: req.body.segment,
    description: req.body.description,
  });
  if (error) return res.status(400).send(error.details[0].message);

  const segment = await Segment.findById(req.body.segment);
  if (!segment)
    return res.status(404).send("The Segment with the given ID was not found.");

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, description: req.body.description, segment },

    {
      new: true,
    }
  );

  if (!blog)
    return res.status(404).send("The Blog with the given ID was not found.");

  res.send(blog);
});
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const blog = await Blog.findByIdAndRemove(req.params.id);

  if (!blog)
    return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.params.id).select("-__v");

  if (!blog)
    return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});
module.exports = router;
