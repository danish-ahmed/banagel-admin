const { Order, validate } = require("../models/order");
const auth = require("../middleware/auth");
const express = require("express");
const { Customer } = require("../models/customer");
const router = express.Router();

router.get("/", async (req, res) => {
  //All Products for admin

  const orders = await Order.find().select("-__v").sort("name");

  //Pagination
  res.range({
    first: req.range.first,
    last: req.range.last,
    length: orders.length,
  });
  res.send(orders.slice(req.range.first, req.range.last + 1));
});
router.post("/", async (req, res) => {
  console.log(req.body);

  var customer = await Customer.findOne({ phone: req.body.phone });
  if (!customer) {
    customer = new Customer({
      email: req.body.email,
      phone: req.body.phone,
      name: req.body.name,
      address: req.body.address,
    });
    customer = await customer.save();
  }
  products = req.body.addedItems.map((product) => {
    return {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      shop: {
        _id: product.shop._id,
        name: product.shop.shopname,
      },
      VAT: product.VAT,
      hasDiscount: product.hasDiscount,
      discount: product.discount,
      discountStartDate: product.discountStartDate,
      discountEndDate: product.discountEndDate,
      description: product.description,
      quantity: product.quantity,
      comment: product.comment,
    };
  });
  let order = new Order({
    products,
    customer: customer,
    VAT: req.body.VAT,
    VATCut: req.body.VATCutTotal.toFixed(2),
    shippingPrice: req.body.shipping.toFixed(2),
    total: req.body.total.toFixed(2),
    endTotal: req.body.endTotal.toFixed(2),
  });
  order = await order.save();

  res.send(order);
});
module.exports = router;
