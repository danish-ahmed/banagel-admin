const Joi = require("joi");
const mongoose = require("mongoose");
const { shopProductSchema } = require("./shopProduct");
const customerSchema = require("./customer");
const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    customer: {
      type: customerSchema,
      required: true,
    },
    VAT: mongoose.Schema.Types.Mixed,
    VATCut: Number,
    shippingPrice: Number,
    products: [
      {
        _id: {
          type: mongoose.ObjectId,
        },
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
          intl: true,
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
        quantity: { type: Number },
        comment: { type: String },
      },
    ],
    // isGold: {
    //   type: Boolean,
    //   default: false
    // },
    // shipping: {
    //   price: {
    //     type: Number,
    //     min: 0,
    //     max: 255,
    //   },
    // },
    total: { type: Number, min: 0, max: 255 },
    endTotal: { type: Number, min: 0, max: 255 },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  })
);

function validateOrder(order) {
  const schema = {
    customer_id: Joi.objectId().required(),
    name: Joi.string().min(5).max(50).optional(),
    products: Joi.array().required(),
    // isGold: Joi.boolean()
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
