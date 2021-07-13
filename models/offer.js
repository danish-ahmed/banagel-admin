const Joi = require("joi");
const mongoose = require("mongoose");
const { segmentSchema } = require("./segment");

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
    intl: true,
  },
  segment: {
    type: segmentSchema,
    required: true,
  },
  products: [
    {
      type: shopProductSchema,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  isVisibleOnSegments: {
    type: Boolean,
    default: false,
  },
  isVisibleOnMainPage: {
    type: Boolean,
    default: false,
  },
});

// Ensure virtual fields are serialised.

const Offer = mongoose.model("Offer", offerSchema);

function validateOffer(genre) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    name_de: Joi.string().min(4).max(50).required(),
    segment: Joi.objectId().required(),
  };

  return Joi.validate(genre, schema);
}

exports.offerSchema = offerSchema;
exports.Offer = Offer;
exports.validate = validateOffer;
