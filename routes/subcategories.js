const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { SubCategory, validate } = require("../models/subcategory");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const filters = JSON.parse(req.query.filter);
  const subcategory = await SubCategory.find()
    .where({ ...filters })
    .select("-__v")
    .sort("name");
  res.range({
    first: JSON.parse(req.query.range)[0],
    last: JSON.parse(req.query.range)[1],
    length: subcategory.length,
  });
  res.send(
    subcategory.slice(
      JSON.parse(req.query.range)[0],
      JSON.parse(req.query.range)[1] + 1
    )
  );
});
router.get("/all", async (req, res) => {
  const subcategory = await SubCategory.find().select("-__v").sort("name");

  res.send(subcategory);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(404)
      .send("The Category with the given ID was not found.");

  const name = {
    en: req.body.name,
    de: req.body.name_de,
  };
  let subcategory = new SubCategory({
    name: name,
    category: category,
  });

  subcategory = await subcategory.save();
  const n_category = await Category.findByIdAndUpdate(
    req.body.category,
    { $push: { subcategories: subcategory._id } },
    { new: true }
  );

  res.send(subcategory);
});
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  // const { error } = validate(req.body);
  console.log(req.params.id);
  const { error } = validate({
    name: req.body.name.en,
    name_de: req.body.name.de,
    category: req.body.category,
  });
  if (error) return res.status(400).send(error.details[0].message);
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(404)
      .send("The Category with the given ID was not found.");
  const prevSubcategory = await SubCategory.findById(req.params.id);
  const subcategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category,
    },
    {
      new: true,
    }
  );
  if (!subcategory)
    return res
      .status(404)
      .send("The SubCategory with the given ID was not found.");

  if (prevSubcategory.category._id !== req.body.category) {
    await Category.findByIdAndUpdate(
      prevSubcategory.category._id,
      { $pull: { subcategories: prevSubcategory._id } },
      { new: true }
    );
    const n_category = await Category.findByIdAndUpdate(
      req.body.category,
      { $push: { subcategories: subcategory._id } },
      { new: true }
    );
  }

  res.send(subcategory);
});
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await SubCategory.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const subcategory = await SubCategory.findById(req.params.id).select("-__v");

  if (!subcategory)
    return res
      .status(404)
      .send("The subcategory with the given ID was not found.");

  res.send(subcategory);
});
module.exports = router;
