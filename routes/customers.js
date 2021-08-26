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
  var phone = "+" + req.body.code + req.body.phone;
  let is_customer = await Customer.findOne({
    phone: phone,
  });
  if (is_customer) {
    const code = Math.floor(100000 + Math.random() * 900000);
    is_customer.authyId = code;
    await is_customer.save();
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    console.log("inside if");
    client.messages
      .create({
        body: `Your OTP Code is ${code}`,
        from: "+15152127592",
        to: phone,
      })
      .then((message) => res.send(message))
      .catch((err) => res.status(400).send("Something Failed"));
  } else {
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log("in else");
    let customer = new Customer({ phone: phone, authyId: code });
    customer = await customer.save();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    console.log(client);
    client.messages
      .create({
        body: `Your OTP Code is ${code}`,
        from: "+15152127592",
        to: phone,
      })
      .then((message) =>
        res.send("Your verification code is send on your number")
      )
      .catch((err) => res.status(400).send("Something Failed"));
  }
});
// router.post("/register", [upload], async (req, res) => {
//   // const { error } = validate(req.body);
//   // if (error) return res.status(400).send(error.details[0].message);
//   // 2hHIFVqS5Knu5ovGmvPC04I87ngZxRUf
//   // var phone = req.body.phone;
//   let is_customer = await Customer.findOne({
//     phone: req.body.code.concat(req.body.phone),
//   });
//   if (is_customer) {
//     is_customer.email !== req.body.email &&
//       is_customer.set("email", req.body.email);
//     try {
//       const regUser = await authy.registerUser({
//         countryCode: req.body.code,
//         email: req.body.email,
//         phone: req.body.phone,
//       });
//       is_customer.set("authyId", regUser.user.id);
//       is_customer = await is_customer.save();
//       authy.requestSms(
//         { authyId: is_customer.authyId },
//         { force: true },
//         function (err, smsRes) {
//           if (err) {
//             console.log("ERROR requestSms", err);
//             res.status(500).json(err);
//             return;
//           }
//           console.log("requestSMS response: ", smsRes);
//           return res.status(200).json({ smsRes, customer: is_customer });
//         }
//       );
//     } catch (err) {
//       console.log("err" + err);
//       return res.status(500).send(err);
//     }
//   } else {
//     //Create New Customer
//     try {
//       let customer = new Customer({
//         email: req.body.email,
//         phone: req.body.code.concat(req.body.phone),
//       });
//       try {
//         const regUser = await authy.registerUser({
//           countryCode: req.body.code,
//           email: req.body.email,
//           phone: req.body.phone,
//         });
//         customer.set("authyId", regUser.user.id);
//         customer = await customer.save();
//         authy.requestSms(
//           { authyId: customer.authyId },
//           { force: true },
//           function (err, smsRes) {
//             if (err) {
//               console.log("ERROR requestSms", err);
//               res.status(500).json(err);
//               return;
//             }
//             console.log("requestSMS response: ", smsRes);
//             return res.status(200).json({ smsRes, customer });

//             // return res.status(200).json(smsRes);
//           }
//         );
//       } catch (err) {
//         console.log("err" + err);
//         return res.status(500).send(err);
//       }
//     } catch (err) {
//       console.log("err" + err);
//       return res.status(500).send(err);
//     }
//   }
//   // console.log(req.body);
// });

router.post("/verify", [upload], async (req, res) => {
  console.log(req.body);
  const customer = await Customer.findOne({
    authyId: req.body.code,
    phone: req.body.phone,
  });
  if (customer) {
    customer.set({ isVerified: true });
    await customer.save();
    const token = customer.generateAuthToken();
    return res.json({
      success: true,
      message: "Enjoy your token!",
      token: token,
      customer: _.pick(customer, ["name", "email", "isVerified"]),
    });
  } else {
    return res.status(400).send("Verification Failed");
  }
  // res.status(200).json({ token: tokenRes, customer: customer });
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
