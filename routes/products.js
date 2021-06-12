const { Product, validate } = require("../models/product");
const { SubCategory } = require("../models/subcategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");

router.get("/", async (req, res) => {
  //All Products for admin
  const products = await Product.find().select("-__v").sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: products.length,
  });
  res.send(products.slice(req.range.first, req.range.last + 1));
});
router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id).select("-__v");

  if (!product)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(product);
});
router.post("/", [upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subcategory = await SubCategory.findById(req.body.category);
  if (!subcategory) return res.status(400).send("Invalid Category.");

  const _file = req.file.filename;

  if (!_file) {
    res.status(400).json({
      success: false,
      message: "Image not provided",
      data: {},
    });
  }

  const product = new Product({
    name: req.body.name,
    image: _file,
    category: subcategory,
    price: req.body.price,
    description: req.body.description,
    createDate: moment().toJSON(),
  });
  await product.save();

  res.send(product);
});

router.put("/:id", [validateObjectId, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subcategory = await SubCategory.findById(req.body.category);
  if (!subcategory) return res.status(400).send("Invalid Category.");

  const _file = req.file.filename;

  if (_file) {
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: _file,
        category: subcategory,
        price: req.body.price,
        description: req.body.description,
        createDate: moment().toJSON(),
      },
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .send("The Product with the given ID was not found.");

    res.send(product);
  } else {
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: subcategory,
        price: req.body.price,
        description: req.body.description,
        createDate: moment().toJSON(),
      },
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .send("The Product with the given ID was not found.");

    res.send(product);
  }
});

module.exports = router;
