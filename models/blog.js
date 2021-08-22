const Joi = require("joi");
const mongoose = require("mongoose");
const { segmentSchema } = require("./segment");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 200,
    // intl: true,
  },
  description: { type: String },
  segment: {
    type: segmentSchema,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

// Ensure virtual fields are serialised.

const Blog = mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  console.log(blog);
  const schema = {
    title: Joi.string().min(4).max(200).required(),
    description: Joi.string(),
    segment: Joi.objectId().required(),
  };

  return Joi.validate(blog, schema);
}

exports.blogSchema = blogSchema;
exports.Blog = Blog;
exports.validate = validateBlog;
