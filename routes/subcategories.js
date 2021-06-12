const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { SubCategory, validate } = require("../models/subcategory");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const subcategory = await SubCategory.find().select("-__v").sort("name");
  res.send(subcategory);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = await Category.findById(req.body.category);

  let subcategory = new SubCategory({
    name: req.body.name,
    category: { _id: category._id, name: category.name },
  });
  subcategory = await subcategory.save();

  res.send(subcategory);
});
router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subcategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: { _id: category._id, name: category.name },
    },
    {
      new: true,
    }
  );

  if (!subcategory)
    return res
      .status(404)
      .send("The Category with the given ID was not found.");

  res.send(subcategory);
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
  const subcategory = await SubCategory.findById(req.params.id).select("-__v");

  if (!subcategory)
    return res
      .status(404)
      .send("The sub category with the given ID was not found.");

  res.send(subcategory);
});
module.exports = router;
