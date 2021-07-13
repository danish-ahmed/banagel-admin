const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },

  phone: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  pricelist: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: ["admin", "member", "rider"],
    default: "member",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = {
    firstname: Joi.string().min(2).max(20).required(),
    lastname: Joi.string().min(2).max(20).required(),
    phone: Joi.string().min(2).max(20).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

function validatePassword(user) {
  const schema = {
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validate;
exports.validatePassword = validatePassword;
