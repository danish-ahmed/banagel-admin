const { Shop, validate } = require("../models/shop");
const { User } = require("../models/user");
const { Category, categorySchema } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const range = require("express-range");
const upload = require("../middleware/fileUpload");
const _ = require("lodash");

router.get("/:id", validateObjectId, async (req, res) => {
  const shop = await Shop.findById(req.params.id).select("-__v");

  if (!shop)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(shop);
});

router.get("/", [auth], async (req, res) => {
  // Members shops
  // const filters = JSON.parse(req.query.filter);
  // if (filters) {
  //   filters.shopname
  //     ? (filters.shopname = "/" + filters.shopname.replace(/['"]+/g, "") + "/")
  //     : null;
  // }
  if (req.user.role !== "admin") {
    const user = User.findById(req.user._id);
    const shops = await Shop.find()
      .where({ owner: req.user._id })
      .select("-__v")
      .populate("owner")
      .sort("name");
    res.range({
      first: req.range.first,
      last: req.range.last,
      length: shops.length,
    });
    res.send(shops.slice(req.range.first, req.range.last + 1));
  }
  //All Shops for admin
  const shops = await Shop.find()
    // .where({ ...filters })
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

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Shop Category.");
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
    category: category,
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

router.put("/:id", [auth, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.owner);
  if (!user) return res.status(400).send("Invalid User.");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Shop Category.");

  const shopname = {
    en: req.body.shopname,
    de: req.body.shopname_de,
  };
  const _file = req.file;
  if (_file) {
    let shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        shopname: shopname,
        address: req.body.address,
        commercialID: req.body.commercialID,
        owner: user,
        category: category,
        phone: req.body.phone,
        publishDate: moment().toJSON(),
        filename:
          req.protocol +
          "://" +
          req.headers.host +
          "/public/uploads/" +
          _file.filename,
      },
      { new: true }
    );
    if (!shop)
      return res.status(404).send("The shop with the given ID was not found.");

    res.send(shop);
  } else {
    let shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        shopname: shopname,
        address: req.body.address,
        commercialID: req.body.commercialID,
        owner: _.pick(user, "_id", "firstname", "lastname", "email"),
        category: category,
        phone: req.body.phone,
        publishDate: moment().toJSON(),
      },
      { new: true }
    );
    if (!shop)
      return res.status(404).send("The shop with the given ID was not found.");

    res.send(shop);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const shop = await Shop.findByIdAndRemove(req.params.id);

  if (!shop)
    return res.status(404).send("The Shop with the given ID was not found.");

  res.send(shop);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const shop = await Movie.findById(req.params.id).select("-__v");

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
