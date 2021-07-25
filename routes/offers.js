const { Offer, validate } = require("../models/offer");
const auth = require("../middleware/auth");
const express = require("express");
const { ShopProduct } = require("../models/shopProduct");
const router = express.Router();
const upload = require("../middleware/fileUpload");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const { Shop } = require("../models/shop");

router.get("/", [auth], async (req, res) => {
  const offers = await Offer.find().select("-__v").sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: offers.length,
  });
  res.send(offers.slice(req.range.first, req.range.last + 1));
});
router.get("/all", async (req, res) => {
  const offers = await Offer.find().select("-__v").sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: offers.length,
  });
  res.send(offers.slice(req.range.first, req.range.last + 1));
});
router.get("/for-main-page", async (req, res) => {
  //All Products for admin

  const offers = await Offer.find({ isVisibleOnMainPage: true })
    .select("-__v")
    .sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: offers.length,
  });
  res.send(offers.slice(req.range.first, req.range.last + 1));
});

router.get("/for-shop-page/:id", validateObjectId, async (req, res) => {
  //All Products for admin
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(400).send("Shop Id invalid");

  const offers = await Offer.find({ owner: shop.owner })
    .select("-__v")
    .sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: offers.length,
  });
  res.send(offers.slice(req.range.first, req.range.last + 1));
});

router.post("/", [auth, upload], async (req, res) => {
  const { error } = validate(
    _.pick(req.body, ["offerName", "description", "isVisibleOnShopsPage"])
  );
  if (error) return res.status(400).send(error.details[0].message);

  const shop = await Shop.findOne({ owner: req.user._id });

  const offerExist = await Offer.findOne({ owner: req.user._id });
  if (offerExist) return res.status(400).send("Offer Limit exceeds");

  const reqProducts = JSON.parse(req.body.products);
  if (reqProducts.length < 0)
    return res.status(499).send("Offer has no product selected");

  let totalPrice = 0;
  products = reqProducts.map((product) => {
    totalPrice += product.price;
    return {
      _id: product._id,
      name: product.name,
      image: product.image,
      actualPrice: product.actualPrice,
      price: product.price,
      unit: product.unit,
      shop: {
        _id: product.shop._id,
        name: product.shop.shopname,
      },
      VAT: product.VAT,
      hasDiscount: product.hasDiscount,
      discount: product.discount,
      discountStartDate: product.discountStartDate,
      discountEndDate: product.discountEndDate,
      description: product.description,
      quantity: product.quantity,
      comment: product.comment,
    };
  });
  let offer = new Offer({
    name: req.body.offerName,
    description: req.body.description,
    products: products,
    shop: shop._id,
    segment: shop.segment._id,
    owner: req.user._id,
    image: req.file
      ? req.protocol +
        "://" +
        req.headers.host +
        "/public/uploads/" +
        req.file.filename
      : undefined,
    isVisibleOnShopsPage: req.body.isVisibleOnShopsPage,
    totalPrice: totalPrice,
  });
  offer = await offer.save();

  res.send(offer);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const offer = await Offer.findById(req.params.id).select("-__v");

  if (!offer)
    return res.status(404).send("The Offer with the given ID was not found.");

  res.send(offer);
});

router.get("/one/:id", validateObjectId, async (req, res) => {
  const offer = await Offer.findById(req.params.id).select("-__v");

  if (!offer)
    return res.status(404).send("The Offer with the given ID was not found.");

  res.send(offer);
});

router.put("/:id", [validateObjectId, upload], async (req, res) => {
  const { error } = validate(
    _.pick(req.body, ["offerName", "description", "isVisibleOnShopsPage"])
  );
  if (error) return res.status(400).send(error.details[0].message);
  const offer = await Offer.findById(req.params.id);
  if (!offer)
    return res.status(404).send("The Offer with the given ID was not found.");

  const reqProducts = JSON.parse(req.body.products);
  let totalPrice = 0;
  products = reqProducts.map((product) => {
    totalPrice += product.price;
    return {
      _id: product._id,
      name: product.name,
      image: product.image,
      actualPrice: product.actualPrice,
      price: product.price,
      unit: product.unit,
      shop: {
        _id: product.shop._id,
        name: product.shop.shopname,
      },
      VAT: product.VAT,
      hasDiscount: product.hasDiscount,
      discount: product.discount,
      discountStartDate: product.discountStartDate,
      discountEndDate: product.discountEndDate,
      description: product.description,
      quantity: product.quantity,
      comment: product.comment,
    };
  });
  let newoffer = await Offer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.offerName,
      description: req.body.description,
      products: products,
      // owner: req.user._id,
      image: req.file
        ? req.protocol +
          "://" +
          req.headers.host +
          "/public/uploads/" +
          req.file.filename
        : offer.image,
      isVisibleOnShopsPage: req.body.isVisibleOnShopsPage,
      totalPrice: totalPrice,
    },
    { new: true }
  );
  if (!newoffer)
    return res.status(404).send("The Offer with the given ID was not found.");

  res.send(newoffer);
});

router.put("/update/:id", [validateObjectId, upload], async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer)
    return res.status(404).send("The Offer with the given ID was not found.");

  let newoffer = await Offer.findByIdAndUpdate(
    req.params.id,
    {
      isVisibleOnMainPage: req.body.isVisibleOnMainPage,
      isVisibleOnSegmentsPage: req.body.isVisibleOnSegmentsPage,
    },
    { new: true }
  );
  if (!newoffer)
    return res.status(404).send("The Offer with the given ID was not found.");

  res.send(newoffer);
});
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const offer = await Offer.findByIdAndRemove(req.params.id);

  if (!offer)
    return res.status(404).send("The Offer with the given ID was not found.");

  res.send(offer);
});
module.exports = router;
