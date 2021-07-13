const Joi = require("joi");
const mongoose = require("mongoose");
const { subCategorySchema } = require("./subcategory");
// const { userSchema } = require("./user");
const { shopSchema } = require("./shop");
const { tagSchema } = require("./tag");
const { productSchema } = require("./product");

const shopProductSchema = new mongoose.Schema({
  product: {
    type: productSchema,
    required: true,
    unique: false,
  },
  shop: {
    type: shopSchema,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    intl: true,
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
  },
  actualPrice: {
    type: Number,
    min: 0,
    max: 255,
  },
  price: {
    type: Number,
    min: 0,
    max: 255,
  },
  VAT: {
    type: Number,
    min: 0,
    max: 99,
  },
  hasDiscount: {
    type: Boolean,
    defaul: false,
  },
  discount: {
    type: Number,
    min: 0,
    max: 99,
  },
  discountStartDate: {
    type: String,
    default: null,
    required: true,
  },
  discountEndDate: {
    type: String,
    default: null,
    required: true,
  },
  description: { type: String },
  createDate: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: tagSchema,
      required: true,
    },
  ],
});

function validateProduct(product) {
  const schema = {
    shop: Joi.objectId().required(),
    product: Joi.objectId().required(),
    name: Joi.string().min(2).max(50).required(),
    name_de: Joi.string().min(2).max(50).required(),
    category: Joi.objectId().required(),
    image: Joi.object(),
    price: Joi.number().min(0).required(),
    VAT: Joi.number().required(),
    hasDiscount: Joi.boolean(),
    description: Joi.string(),
    discount: Joi.number().min(0).max(99),
    discount_start_date: Joi.optional(),
    discount_end_date: Joi.optional(),
    file: Joi.optional(),
    tags: Joi.optional(),
  };
  return Joi.validate(product, schema);
}

const ShopProduct = mongoose.model("ShopProducts", shopProductSchema);
exports.ShopProduct = ShopProduct;
exports.shopProductSchema = shopProductSchema;
exports.validate = validateProduct;
