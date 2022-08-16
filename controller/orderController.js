const BigPromise = require("../middleware/bigPromise");
const Product = require("../models/Product");
const Order = require("../models/Order");
const CustomError = require("../utils/customErrors");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    user: req.user._id,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new CustomError("order does not exist", 401));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

exports.getLoggedInOrders = BigPromise(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new CustomError("order does not exist", 401));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminGetOrders = BigPromise(async (req, res, next) => {
  const order = await Order.find();

  res.status(200).json({
    success: true,
    order,
  });
});
exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.OrderStatus === "delivered") {
    return next(new CustomError("product already delivered", 401));
  }
  order.OrderStatus = req.body.orderStatus;

  order.orderItems.forEach(async prod=>{
    await updateProductStock(prod.product , prod.quantity)
  })
  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});
exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

 
  await order.remove();

  res.status(200).json({
    success: true,
  });
});
async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({
    validateBeforeSave: false,
  });
}
