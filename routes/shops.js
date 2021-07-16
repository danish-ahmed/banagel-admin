const { Shop, validate } = require("../models/shop");
const { User } = require("../models/user");
const { Segment, segmentSchema } = require("../models/segment");
const { ShopProduct } = require("../models/shopProduct");
const { Product } = require("../models/product");
const { SubCategory } = require("../models/subcategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const range = require("express-range");
const multer = require("multer");
const upload = require("../middleware/fileUpload");
const _ = require("lodash");
const sizeOf = require("image-size");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (req, file, callback) {
    if (file.originalname.length > 6)
      callback(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          file.originalname.substr(
            file.originalname.length - 6,
            file.originalname.length
          )
      );
    else callback(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
const _upload = multer({ storage: storage });
var mm = _upload.fields([
  {
    name: "file",
    maxCount: 1,
  },
  {
    name: "landingFile",
    maxCount: 1,
  },
]);

router.get("/:id", validateObjectId, async (req, res) => {
  const shop = await Shop.findById(req.params.id).select("-__v");

  if (!shop)
    return res.status(404).send("The Shop with the given ID was not found.");

  res.send(shop);
});

router.get("/", [auth], async (req, res) => {
  // Members shops
  const filters = JSON.parse(req.query.filter);
  if (filters.name) {
    const lang = req.headers.language;
    filters[`shopname.${lang}`] = filters.name;
    delete filters.name;
  }
  if (req.user.role !== "admin") {
    // const user = User.findById(req.user._id);
    const shops = await Shop.find()
      .where({ owner: req.user._id })
      .select("-__v")
      .populate("owner")
      .sort("name");
    console.log(req.user._id);
    res.range({
      first: req.range.first,
      last: req.range.last,
      length: shops.length,
    });
    res.send(shops.slice(req.range.first, req.range.last + 1));
  }
  //All Shops for admin
  const shops = await Shop.find()
    .where({ ...filters })
    .select("-__v")
    .populate("owner")
    .sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: shops.length,
  });
  res.send(shops.slice(req.range.first, req.range.last + 1));
});

router.post("/", [auth, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.owner);
  if (!user) return res.status(400).send("Invalid User.");

  const segment = await Segment.findById(req.body.segment);
  if (!segment) return res.status(400).send("Invalid Segment.");
  const _file = req.file;

  if (!_file) {
    res.status(400).json({
      success: false,
      message: "file not provided",
      data: {},
    });
  }
  const shopname = {
    en: req.body.shopname,
    de: req.body.shopname_de,
  };

  const shop = new Shop({
    shopname: shopname,
    address: req.body.address,
    commercialID: req.body.commercialID,
    owner: user,
    segment: segment,
    phone: req.body.phone,
    publishDate: moment().toJSON(),
    filename:
      req.protocol +
      "://" +
      req.headers.host +
      "/public/uploads/" +
      _file.filename,
  });
  await shop.save();

  res.send(shop);
});

router.put("/:id", [auth, mm], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.owner);
  if (!user) return res.status(400).send("Invalid User.");

  const segment = await Segment.findById(req.body.segment);
  if (!segment) return res.status(400).send("Invalid Shop Segment.");

  const shopname = {
    en: req.body.shopname,
    de: req.body.shopname_de,
  };
  const description = {
    en: req.body.description_en,
    de: req.body.description_de,
  };
  const _file = req.files.file;
  const _landingFile = req.files.landingFile;

  if (_file) {
    if (_landingFile) {
      let shop = await Shop.findByIdAndUpdate(
        req.params.id,
        {
          shopname: shopname,
          description: description,
          address: req.body.address,
          commercialID: req.body.commercialID,
          // owner: user,
          segment: segment,
          phone: req.body.phone,
          publishDate: moment().toJSON(),
          filename:
            req.protocol +
            "://" +
            req.headers.host +
            "/public/uploads/" +
            _file[0].filename,
          landingImage: _landingFile
            ? req.protocol +
              "://" +
              req.headers.host +
              "/public/uploads/" +
              _landingFile[0].filename
            : null,
        },
        { new: true }
      );
      if (!shop)
        return res
          .status(404)
          .send("The shop with the given ID was not found.");

      res.send(shop);
    } else {
      let shop = await Shop.findByIdAndUpdate(
        req.params.id,
        {
          shopname: shopname,
          address: req.body.address,
          commercialID: req.body.commercialID,
          // owner: user,
          description: description,

          segment: segment,
          phone: req.body.phone,
          publishDate: moment().toJSON(),
          filename:
            req.protocol +
            "://" +
            req.headers.host +
            "/public/uploads/" +
            _file[0].filename,
        },
        { new: true }
      );
      if (!shop)
        return res
          .status(404)
          .send("The shop with the given ID was not found.");

      res.send(shop);
    }
  }
  if (_landingFile) {
    let shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        shopname: shopname,
        address: req.body.address,
        commercialID: req.body.commercialID,
        // owner: user,
        description: description,

        segment: segment,
        phone: req.body.phone,
        publishDate: moment().toJSON(),

        landingImage: _landingFile
          ? req.protocol +
            "://" +
            req.headers.host +
            "/public/uploads/" +
            _landingFile[0].filename
          : null,
      },
      { new: true }
    );
    if (!shop)
      return res.status(404).send("The shop with the given ID was not found.");

    res.send(shop);
  }
  let shop = await Shop.findByIdAndUpdate(
    req.params.id,
    {
      shopname: shopname,
      address: req.body.address,
      description: description,

      commercialID: req.body.commercialID,
      owner: _.pick(user, "_id", "firstname", "lastname", "email"),
      segment: segment,
      phone: req.body.phone,
      publishDate: moment().toJSON(),
    },
    { new: true }
  );
  if (!shop)
    return res.status(404).send("The shop with the given ID was not found.");

  res.send(shop);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const shop = await Shop.findByIdAndRemove(req.params.id);

  if (!shop)
    return res.status(404).send("The Shop with the given ID was not found.");

  res.send(shop);
});

router.get("/products/:id", validateObjectId, async (req, res) => {
  const filters = JSON.parse(req.query.filters);

  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(400).send("Invalid Shop ID.");

  const segment = await Segment.findById(shop.segment._id);
  if (!segment) return res.status(400).send("Invalid Segment ID.");

  const subcategories = await SubCategory.find()
    .where({ ["category.segment._id"]: segment._id })
    .sort("name");
  const subcategories_ids = await SubCategory.find()
    .where({ ["category.segment._id"]: segment._id })
    .select("_id")
    .sort("name");
  var products = setDiscountPrice(
    await ShopProduct.find()
      .where({
        ["category._id"]:
          filters.subcategory && filters.subcategory.length > 0
            ? await SubCategory.find({ _id: filters.subcategory }).select("_id")
            : subcategories_ids,
        ["product._id"]:
          filters.product && filters.product.length > 0
            ? filters.product
            : { $ne: null },
        ["shop._id"]: shop._id,
      })
      .select("-__v")
  );

  const productList = await Product.find()
    .where({ ["category._id"]: subcategories_ids })
    .select("_id, name")
    .sort("name");

  return res.send({
    segmentData: segment,
    products,
    shop,
    productList: productList,
    subcategories,
  });
});
const setDiscountPrice = (products) => {
  //   discount_start_date
  // discount_end_date
  const currentDate = Date.now();
  let newProducts = products.map((product) => {
    console.log(
      product.hasDiscount,
      currentDate,
      Date.parse(product.discountStartDate),
      Date.parse(product.discountEndDate)
    );
    if (
      product.hasDiscount &&
      currentDate >= Date.parse(product.discountStartDate) &&
      currentDate <= Date.parse(product.discountEndDate)
    ) {
      product.price =
        product.actualPrice - (product.dicount * product.actualPrice) / 100;
      return product;
    } else {
      console.log("in else");
      product.price = product.actualPrice;
      return product;
    }
  });
  return newProducts;
};
module.exports = router;
