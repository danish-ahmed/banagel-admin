const Joi = require("joi");
const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    intl: true,
  },
});

// Ensure virtual fields are serialised.

const Segment = mongoose.model("Segment", segmentSchema);

function validateSegment(genre) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    name_de: Joi.string().min(2).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

exports.segmentSchema = segmentSchema;
exports.Segment = Segment;
exports.validate = validateSegment;
