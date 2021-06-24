const Joi = require("joi");
const mongoose = require("mongoose");
const { subCategorySchema } = require("./subcategory");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
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
  price: {
    type: Number,
    min: 0,
    max: 255,
  },
  description: { type: String },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    name_de: Joi.string().min(2).max(50).required(),
    category: Joi.objectId().required(),
    image: Joi.object(),
    price: Joi.number().min(0).required(),
    description: Joi.string(),
    file: Joi.string(),
  };
  return Joi.validate(product, schema);
}

const Product = mongoose.model("Products", productSchema);
exports.Product = Product;
exports.productSchema = productSchema;
exports.validate = validateProduct;
