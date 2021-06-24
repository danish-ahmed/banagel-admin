const mongoose = require("mongoose");
module.exports = function (req, res, next) {
  const language = req.header("language");
  if (language) {
    mongoose.setDefaultLanguage(language);
  }
  next();
};
