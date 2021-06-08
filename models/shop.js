const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");
const { userSchema } = require("./user");
const Schema = mongoose.Schema;
const geocoder = require("../startup/geocoder");

const shopSchema = new mongoose.Schema({
  shopname: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
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
    maxlength: 20,
    get: function (v) {
      return "http://localhost:5000/public/uploads/" + v;
    },
  },
  commercialID: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: new mongoose.Schema({
      firstname: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      lastname: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
});

shopSchema.set("toObject", { getters: true });
shopSchema.set("toJSON", { getters: true });

shopSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
// shopSchema.set("toJSON", {
//   virtuals: true,
// });

const Shop = mongoose.model("Shops", shopSchema);

function validateShop(shop) {
  const schema = {
    shopname: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(5).max(255).required(),
    commercialID: Joi.string().min(2).max(15).required(),
    phone: Joi.string().min(2).max(20).required(),
    owner: Joi.objectId().required(),
    category: Joi.objectId().required(),
  };

  return Joi.validate(shop, schema);
}

exports.Shop = Shop;
exports.validate = validateShop;
