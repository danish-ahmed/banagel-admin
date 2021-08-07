const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");
const Client = require("authy-client").Client;
const authy = new Client({ key: "8640p5Vu16TC605C1qRd6oCMPWGAIUC7" });
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().select("-__v").sort("name");
  res.send(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    // isGold: req.body.isGold,
    phone: req.body.phone,
    address: req.body.address,
  });
  customer = await customer.save();

  res.send(customer);
});

router.post("/register", [upload], async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // 2hHIFVqS5Knu5ovGmvPC04I87ngZxRUf
  // var phone = req.body.phone;
  let is_customer = await Customer.findOne({
    phone: req.body.code.concat(req.body.phone),
  });
  if (is_customer) {
    is_customer.email !== req.body.email &&
      is_customer.set("email", req.body.email);
    try {
      const regUser = await authy.registerUser({
        countryCode: req.body.code,
        email: req.body.email,
        phone: req.body.phone,
      });
      is_customer.set("authyId", regUser.user.id);
      is_customer = await is_customer.save();
      authy.requestSms(
        { authyId: is_customer.authyId },
        { force: true },
        function (err, smsRes) {
          if (err) {
            console.log("ERROR requestSms", err);
            res.status(500).json(err);
            return;
          }
          console.log("requestSMS response: ", smsRes);
          return res.status(200).json({ smsRes, customer: is_customer });
        }
      );
    } catch (err) {
      console.log("err" + err);
      return res.status(500).send(err);
    }
  } else {
    //Create New Customer
    try {
      let customer = new Customer({
        email: req.body.email,
        phone: req.body.code.concat(req.body.phone),
      });
      try {
        const regUser = await authy.registerUser({
          countryCode: req.body.code,
          email: req.body.email,
          phone: req.body.phone,
        });
        customer.set("authyId", regUser.user.id);
        customer = await customer.save();
        authy.requestSms(
          { authyId: customer.authyId },
          { force: true },
          function (err, smsRes) {
            if (err) {
              console.log("ERROR requestSms", err);
              res.status(500).json(err);
              return;
            }
            console.log("requestSMS response: ", smsRes);
            return res.status(200).json({ smsRes, customer });

            // return res.status(200).json(smsRes);
          }
        );
      } catch (err) {
        console.log("err" + err);
        return res.status(500).send(err);
      }
    } catch (err) {
      console.log("err" + err);
      return res.status(500).send(err);
    }
  }
  // console.log(req.body);
});
router.post("/verify", [upload], async (req, res) => {
  console.log(req.body);
  const customer = await Customer.findOne({ authyId: req.body.authyId });
  await authy.verifyToken(
    { authyId: customer.authyId, token: req.body.code },
    async function (err, tokenRes) {
      if (err) {
        console.log("Verify Token Error: ", err);
        res.status(500).json(err);
        return;
      }
      console.log("Verify Token Response: ", tokenRes);
      customer.set({ isVerified: true });
      await customer.save();
      const token = customer.generateAuthToken();
      return res.json({
        success: true,
        message: "Enjoy your token!",
        token: token,
        customer: _.pick(customer, ["name", "email", "isVerified"]),
      });
      // res.status(200).json({ token: tokenRes, customer: customer });
    }
  );
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:id", auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-__v");

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
