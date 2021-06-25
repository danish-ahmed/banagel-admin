const Joi = require("joi");
const mongoose = require("mongoose");
const { segmentSchema } = require("./segment");
const { userSchema } = require("./user");
const Schema = mongoose.Schema;

const shopSchema = new mongoose.Schema({
  shopname: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    intl: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: { Number },
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  phone: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  filename: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  commercialID: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  segment: {
    type: segmentSchema,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Shop = mongoose.model("Shops", shopSchema);

function validateShop(shop) {
  const schema = {
    shopname: Joi.string().min(2).max(50).required(),
    shopname_de: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(5).max(255).required(),
    commercialID: Joi.string().min(2).max(15).required(),
    phone: Joi.string().min(2).max(20).required(),
    owner: Joi.objectId().required(),
    file: Joi.optional(),
    segment: Joi.objectId().required(),
  };

  return Joi.validate(shop, schema);
}

exports.Shop = Shop;
exports.shopSchema = shopSchema;
exports.validate = validateShop;
