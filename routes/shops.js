const { Shop, validate } = require("../models/shop");
const { User } = require("../models/user");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const range = require("express-range");

router.get("/:id", validateObjectId, async (req, res) => {
  const shop = await Shop.findById(req.params.id).select("-__v");

  if (!shop)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(shop);
});
router.get("/", [auth], async (req, res) => {
  // Members shops
  const filters = JSON.parse(req.query.filter);
  if (filters) {
    filters.shopname
      ? (filters.shopname = "/" + filters.shopname.replace(/['"]+/g, "") + "/")
      : null;
  }
  console.log(filters);
  if (req.user.role !== "admin") {
    const shops = await Shop.find()
      .where({ owner: req.user, ...filters })
      .select("-__v")
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
    .where({ ...filters })
    .select("-__v")
    .sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: shops.length,
  });
  res.send(shops.slice(req.range.first, req.range.last + 1));
});

router.post("/", [auth], async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const genre = await Genre.findById(req.body.genreId);
  // if (!genre) return res.status(400).send("Invalid genre.");
  const user = await User.findById(req.body.owner);
  if (!user) return res.status(400).send("Invalid User.");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Shop Category.");

  const shop = new Shop({
    shopname: req.body.shopname,
    // genre: {
    //   _id: genre._id,
    //   name: genre.name,
    // },
    address: req.body.address,
    commercialID: req.body.commercialID,
    owner: user._id,
    category: { _id: category._id, name: category.name },
    phone: req.body.phone,
    publishDate: moment().toJSON(),
  });
  await shop.save();

  res.send(shop);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      shopname: req.body.title,
      address: req.body.address,
      commercialID: req.body.commercialID,
      category: { _id: category._id, name: category.name },
      phone: req.body.phone,
      publishDate: moment().toJSON(),
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const shop = await Shop.findByIdAndRemove(req.params.id);

  if (!shop)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(shop);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id).select("-__v");

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
