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
const { Segment } = require("../models/segment");
const { Category } = require("../models/category");
const { filter } = require("lodash");

router.get("/", [auth], async (req, res) => {
  //All Products for admin
  if (req.user.role == "member") {
    const user_shop = await Shop.findOne()
      .where({ owner: req.user._id })
      .sort("name");
    console.log(user_shop);
    const shopproducts = await ShopProduct.find()
      .where({ "shop._id": user_shop._id })
      .select("-__v")
      .sort("name");
    res.range({
      first: req.range.first,
      last: req.range.last,
      length: shopproducts.length,
    });
    res.send(shopproducts.slice(req.range.first, req.range.last + 1));
  }
  const shopproducts = await ShopProduct.find().select("-__v").sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: shopproducts.length,
  });
  res.send(shopproducts.slice(req.range.first, req.range.last + 1));
});
router.get("/:id", validateObjectId, async (req, res) => {
  const product = await ShopProduct.findById(req.params.id).select("-__v");

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});
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
    _file =
      req.protocol +
      "://" +
      req.headers.host +
      "/public/uploads/" +
      req.file.filename;
  }
  if (!_file) {
    _file = product.image;
  }
  let dis_date = {};
  if (req.body.hasDiscount === false) {
    dis_date = {
      discountStartDate: moment().toJSON(),
      discountEndDate: moment().toJSON(),
      actualPrice: req.body.price,
      price: req.body.price,
    };
  } else {
    dis_date = {
      discountStartDate: req.body.discount_start_date || moment().toJSON(),
      discountEndDate: req.body.discount_end_date || moment().toJSON(),
      actualPrice: req.body.price,
      price: (
        req.body.price -
        (req.body.price * req.body.discount) / 100
      ).toFixed(2),
    };
  }
  const shopproduct = new ShopProduct({
    shop: shop,
    name: { en: req.body.name, de: req.body.name_de },
    image: _file,
    product: product,
    category: subcategory,
    price: dis_date.price,
    actualPrice: dis_date.actualPrice,
    VAT: req.body.VAT,
    discount: req.body.discount,
    hasDiscount: req.body.hasDiscount,
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    discount: req.body.discount,
    discountStartDate: dis_date.discountStartDate,
    discountEndDate: dis_date.discountEndDate,
    description: req.body.description,
    createDate: moment().toJSON(),
  });
  await shopproduct.save();

  res.send(shopproduct);
});

router.put("/:id", [upload, validateObjectId], async (req, res) => {
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
    _file =
      req.protocol +
      "://" +
      req.headers.host +
      "/public/uploads/" +
      req.file.filename;
  }
  if (!_file) {
    _file = product.image;
  }
  let dis_date = {};
  if (req.body.hasDiscount === false) {
    dis_date = {
      discountStartDate: moment().toJSON(),
      discountEndDate: moment().toJSON(),
      actualPrice: req.body.price,
      price: req.body.price,
    };
  } else {
    dis_date = {
      discountStartDate: req.body.discount_start_date,
      discountEndDate: req.body.discount_end_date,
      actualPrice: req.body.price,
      price: (
        req.body.price -
        (req.body.price * req.body.discount) / 100
      ).toFixed(2),
    };
  }

  let shopproduct = await ShopProduct.findByIdAndUpdate(
    req.params.id,
    {
      shop: shop,
      name: { en: req.body.name, de: req.body.name_de },
      image: _file,
      product: product,
      category: subcategory,
      price: dis_date.price,
      actualPrice: dis_date.actualPrice,
      VAT: req.body.VAT,
      hasDiscount: req.body.hasDiscount,
      tags: req.body.tags && JSON.parse(req.body.tags),
      discount: req.body.discount,
      discountStartDate: dis_date.discountStartDate,
      discountEndDate: dis_date.discountEndDate,
      description: req.body.description,
      createDate: moment().toJSON(),
    },
    {
      new: true,
    }
  );

  res.send(shopproduct);
});
router.delete("/:id", [auth], async (req, res) => {
  const shopproduct = await ShopProduct.findByIdAndRemove(req.params.id);

  if (!shopproduct)
    return res.status(404).send("The Shop with the given ID was not found.");

  res.send(shopproduct);
});

router.get("/segment/:id", [validateObjectId], async (req, res) => {
  //All Products for admin
  const segment = await Segment.findById(req.params.id);
  if (!segment) return res.status(400).send("Invalid Segment ID.");
  const shops = await Shop.find().where({ segment });
  const shopproducts = await ShopProduct.find()
    .where("shop")
    .in(shops)
    .select("-__v")
    .sort("name");

  res.send({ segment: segment._id, data: shopproducts });
});

router.get("/segment-page/:id", [validateObjectId], async (req, res) => {
  //All Products for admin
  const filters = JSON.parse(req.query.filters);
  const segment = await Segment.findById(req.params.id);
  if (!segment) return res.status(400).send("Invalid Segment ID.");

  console.log("segment", segment);
  const subcategories = await SubCategory.find({
    ["category.segment._id"]: segment._id,
  }).sort("name");
  const subcategorie_ids = await SubCategory.find()
    .where({ ["category.segment"]: segment })
    .select("_id")
    .sort("name");
  console.log("subcategories ", subcategorie_ids);
  var shops = await ShopProduct.find()
    .where({
      ["category._id"]:
        filters.subcategory && filters.subcategory.length > 0
          ? await SubCategory.find({ _id: filters.subcategory }).select("_id")
          : subcategorie_ids,
      ["product._id"]:
        filters.product && filters.product.length > 0
          ? filters.product
          : { $ne: null },
    })
    .select("shop");

  const products = await Product.find()
    .where({ ["category._id"]: subcategorie_ids })
    .select("_id, name")
    .sort("name");

  return res.send({
    segment: segment._id,
    segmentData: segment,
    shops,
    data: products,
    subcategories,
  });
});

router.get("/segment-page-old/:id", [validateObjectId], async (req, res) => {
  //All Products for admin
  const filters = JSON.parse(req.query.filters);
  const segment = await Segment.findById(req.params.id);
  if (!segment) return res.status(400).send("Invalid Segment ID.");
  const subcategories = await SubCategory.find()
    .where({ ["category.segment"]: segment })
    .select("-__v")
    .sort("name");
  const shops = await Shop.find().where({ segment });
  if (filters) {
    if (filters.subcategory && filters.subcategory.length > 0) {
      const shopproducts = await ShopProduct.find()
        .where({
          shop:
            filters.shop && filters.shop.length > 0
              ? await Shop.find({ _id: filters.shop })
              : shops,
          ["category"]:
            filters.subcategory && filters.subcategory.length > 0
              ? await SubCategory.find({ _id: filters.subcategory })
              : null,
        })
        .select("-__v")
        .sort("name");
      console.log(await SubCategory.find({ _id: filters.subcategory }));
      return res.send({
        segment: segment._id,
        segmentData: segment,
        shops: shops,
        data: shopproducts,
        subcategories,
      });
    }
    const shopproducts = await ShopProduct.find()
      .where({
        shop:
          filters.shop && filters.shop.length > 0
            ? await Shop.find({ _id: filters.shop })
            : shops,
      })
      .select("-__v")
      .sort("name");
    return res.send({
      segment: segment._id,
      segmentData: segment,
      shops: shops,
      data: shopproducts,
      subcategories,
    });
  } else {
    const shopproducts = await ShopProduct.find()
      .where({ shop: shops })
      .select("-__v")
      .sort("name");
    return res.send({
      segment: segment._id,
      segmentData: segment,
      shops: shops,
      data: shopproducts,
      subcategories,
    });
  }
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
