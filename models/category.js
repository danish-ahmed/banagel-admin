const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
    intl: true,
  },
});

// Ensure virtual fields are serialised.

const Category = mongoose.model("Category", categorySchema);

function validateCategory(genre) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    name_de: Joi.string().min(4).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
