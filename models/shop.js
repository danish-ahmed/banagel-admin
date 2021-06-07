const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");
const Schema = mongoose.Schema;

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
  phone: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});

shopSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
shopSchema.set("toJSON", {
  virtuals: true,
});
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
