const Joi = require("joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    intl: true,
  },
});

// Ensure virtual fields are serialised.

const Tag = mongoose.model("Tag", tagSchema);

function validateTag(genre) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

exports.tagSchema = tagSchema;
exports.Tag = Tag;
exports.validate = validateTag;
