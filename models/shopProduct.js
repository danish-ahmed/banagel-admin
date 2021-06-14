const Joi = require("joi");
const mongoose = require("mongoose");
const { subCategorySchema } = require("./subcategory");
// const { userSchema } = require("./user");
const { shopSchema } = require("./shop");
const { productSchema } = require("./product");

const shopProductSchema = new mongoose.Schema({
  shop: {
    type: shopSchema,
    required: true,
  },
  product: {
    type: productSchema,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  category: {
    type: subCategorySchema,
    required: true,
  },
  image: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    get: function (v) {
      return "http://localhost:5000/public/uploads/" + v;
    },
  },
  price: {
    type: Number,
    min: 0,
    max: 255,
  },
  discount: {
    type: Number,
    min: 0,
    max: 99,
  },
  description: { type: String },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

shopProductSchema.set("toObject", { getters: true });
shopProductSchema.set("toJSON", { getters: true });

shopProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

function validateProduct(product) {
  const schema = {
    shop: Joi.objectId().required(),
    product: Joi.objectId().required(),
    name: Joi.string().min(2).max(50).required(),
    category: Joi.objectId().required(),
    image: Joi.object(),
    price: Joi.number().min(0).required(),
    description: Joi.string(),
    discount: Joi.number().min(0).max(99),
  };
  return Joi.validate(product, schema);
}

const ShopProduct = mongoose.model("ShopProducts", shopProductSchema);
exports.ShopProduct = ShopProduct;
exports.shopProductSchema = shopProductSchema;
exports.validate = validateProduct;
