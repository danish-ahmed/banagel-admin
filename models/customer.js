const Joi = require("joi");
const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  // isGold: {
  //   type: Boolean,
  //   default: false
  // },
  address: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.email().min(5).max(50).optional(),
    phone: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(50).required(),
    // isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
