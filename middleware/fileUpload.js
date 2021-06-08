const multer = require("multer");
const path = require("path");
function fileFilter(req, file, cb) {
  // Allowed ext
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("File types allowed .jpeg, .jpg and .png!"));
  }
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).single("filename");

module.exports = upload;
