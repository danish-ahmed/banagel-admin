const { ShopProduct, validate } = require("../models/shopProduct");
const { Product } = require("../models/product");
const { Shop } = require("../models/shop");
const { SubCategory } = require("../models/subcategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");

// router.get("/", async (req, res) => {
//   //All Products for admin
//   const products = await Product.find().select("-__v").sort("name");

//   //Pagination
//   res.range({
//     first: req.range.first,
//     last: req.range.last,
//     length: products.length,
//   });
//   res.send(products.slice(req.range.first, req.range.last + 1));
// });
// router.get("/:id", validateObjectId, async (req, res) => {
//   const product = await Product.findById(req.params.id).select("-__v");

//   if (!product)
//     return res.status(404).send("The genre with the given ID was not found.");

//   res.send(product);
// });
router.post("/", [upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subcategory = await SubCategory.findById(req.body.category);
  if (!subcategory) return res.status(400).send("Invalid Category.");

  const shop = await Shop.findById(req.body.shop);
  if (!shop) return res.status(400).send("Invalid Shop.");

  const product = await Product.findById(req.body.product);
  if (!product) return res.status(400).send("Invalid Product.");

  let _file = "";
  if (req.file) {
    _file = req.file.filename;
  }
  if (!_file) {
    _file = product.image;
  }

  const shopproduct = new ShopProduct({
    shop: { _id: shop._id, name: shop.name },
    name: req.body.name,
    image: _file,
    category: subcategory,
    price: req.body.price,
    discount: req.body.discount,
    description: req.body.description,
    createDate: moment().toJSON(),
  });
  await shopproduct.save();

  res.send(shopproduct);
});

// router.put("/:id", [validateObjectId, upload], async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const subcategory = await SubCategory.findById(req.body.category);
//   if (!subcategory) return res.status(400).send("Invalid Category.");

//   if (req.file) {
//     const _file = req.file.filename;

//     let product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         name: req.body.name,
//         image: _file,
//         category: subcategory,
//         price: req.body.price,
//         description: req.body.description,
//         createDate: moment().toJSON(),
//       },
//       { new: true }
//     );
//     if (!product)
//       return res
//         .status(404)
//         .send("The Product with the given ID was not found.");

//     res.send(product);
//   } else {
//     let product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         name: req.body.name,
//         category: subcategory,
//         price: req.body.price,
//         description: req.body.description,
//         createDate: moment().toJSON(),
//       },
//       { new: true }
//     );
//     if (!product)
//       return res
//         .status(404)
//         .send("The Product with the given ID was not found.");

//     res.send(product);
//   }
// });

module.exports = router;
