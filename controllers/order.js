//controller
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

//POST request
exports.create = exceptionHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0 || !shippingAddress || !paymentMethod) {
    throw new Error("Invalid order creation pattern");
  }

  let totalAmount = 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id).session(session);

        if (!product) {
          throw new Error(`Product with ID ${item._id} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Product ${product.name} is out of stock`);
        }

        const price = product.price;
        const total = price * item.quantity;

        totalAmount += total;

        product.stock -= item.quantity;
        await product.save({ session });

        return {
          product: item._id,
          quantity: item.quantity,
          price,
          total,
        };
      })
    );

    totalAmount = parseFloat(totalAmount.toFixed(2));

    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    const savedOrder = await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      status: "success",
      data: savedOrder,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
});

//GET request
exports.getAll = exceptionHandler(async (req, res) => {
  const { data, pagination } = await paginate(Order, req.query, [
    { path: "items.product", select: "_id images name stock price" },
    { path: "user", select: "_id name email role" },
  ]);

  if (!data) {
    const error = new Error("orders doesn't exist");
    error.statusCode = 400;
    throw error;
  }

  res.status(200).json({
    status: "success",
    pagination,
    data,
  });
});

//GET request
exports.getAllMine = exceptionHandler(async (req, res) => {
  const user = { ...req.user };

  const { _id } = user._doc;

  const filters = { ...req.query, user: _id };

  const { data, pagination } = await paginate(Order, filters, [
    { path: "items.product", select: "_id images name stock price" },
    { path: "user", select: "_id name email role" },
  ]);

  if (!data) {
    const error = new Error("orders doesn't exist");
    error.statusCode = 400;
    throw error;
  }
  res.status(200).json({
    status: "success",
    pagination,
    data,
  });
});

//GET request
exports.getOne = exceptionHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("user", "_id name email role")
    .populate("items.product", "_id images name stock price");

  if (!order) {
    throw new Error(`Order ID: ${id} doesn't exist`);
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//PATCH request
exports.updateOne = exceptionHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!order) {
    throw new Error(`Order ID: ${id} doesn't exist`);
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//DELETE request
exports.deleteOne = exceptionHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new Error(`Order ID: ${id} doesn't exist`);
  }
  res.status(200).json({
    status: "success",
    data: order,
  });
});

//PATCH request
exports.updatePaymentStatus = exceptionHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    throw new Error("payment status not valid");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      paymentStatus,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedOrder) {
    throw new Error("Payment status updation failed");
  }

  res.status(200).json({
    status: "success",
    updatedOrder,
  });
});

//PATCH request
exports.updateOrderStatus = exceptionHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    throw new Error("order status not valid");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedOrder) {
    throw new Error("Order status updation failed");
  }

  res.status(200).json({
    status: "success",
    updatedOrder,
  });
});
