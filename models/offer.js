const Joi = require("joi");
const mongoose = require("mongoose");
const { shopProductSchema } = require("./shopProduct");

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  products: [
    {
      _id: {
        type: mongoose.ObjectId,
      },
      shop: {
        _id: { type: mongoose.ObjectId },
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
          intl: true,
        },
      },
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        intl: true,
      },
      unit: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 255,
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
        // required: true,
      },
      discountEndDate: {
        type: String,
        default: null,
        // required: true,
      },
      description: { type: String },
      createDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },
  isVisibleOnSegmentsPage: {
    type: Boolean,
    default: false,
  },
  isVisibleOnShopsPage: {
    type: Boolean,
    default: false,
  },
  isVisibleOnMainPage: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    minlength: 2,
    maxlength: 200,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Segment",
  },
  // offerStartDate: {
  //   type: String,
  //   default: null,
  //   required: true,
  // },
  // offerEndDate: {
  //   type: String,
  //   default: null,
  //   required: true,
  // },
});

// Ensure virtual fields are serialised.

const Offer = mongoose.model("Offer", offerSchema);

function validateOffer(genre) {
  const schema = {
    offerName: Joi.string().min(4).max(50).required(),
    description: Joi.string().optional(),
    isVisibleOnShopsPage: Joi.boolean(),
  };

  return Joi.validate(genre, schema);
}

exports.offerSchema = offerSchema;
exports.Offer = Offer;
exports.validate = validateOffer;
