const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  category: {
    type: categorySchema,
    required: true,
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

function validateCategory(genre) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    category: Joi.objectId().required(),
  };

  return Joi.validate(genre, schema);
}

exports.subCategorySchema = subCategorySchema;
exports.SubCategory = SubCategory;
exports.validate = validateCategory;
