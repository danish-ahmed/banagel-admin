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
  description: { type: String },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

productSchema.set("toObject", { getters: true });
productSchema.set("toJSON", { getters: true });

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    category: Joi.objectId().required(),
    image: Joi.object(),
    price: Joi.number().min(0).required(),
    description: Joi.string(),
  };
  return Joi.validate(product, schema);
}

const Product = mongoose.model("Products", productSchema);
exports.Product = Product;
exports.productSchema = productSchema;
exports.validate = validateProduct;
