const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate, validatePassword } = require("../models/user");
const { Shop } = require("../models/shop");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.get("/user-shop/:id", [auth, validateObjectId], async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user });

  if (!shop)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(shop);
});
router.get("/", [auth], async (req, res) => {
  const user = await User.find({ _id: req.user._id }).select("-password");
  res.send(user);
});
router.get("/:id", [auth], async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  res.send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("User Not Found.");

  user.name = req.body.name;
  user.password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  // const token = user.generateAuthToken();
  res.send(_.pick(user, ["_id", "name", "email"]));
});
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, [
      "firstname",
      "lastname",
      "address",
      "shopname",
      "commercialID",
      "phone",
      "role",
      "email",
      "password",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "role"]));
});

module.exports = router;
