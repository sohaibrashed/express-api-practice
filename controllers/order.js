const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const AppError = require("../util/appError");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

const defaultPopulateOptions = [
  {
    path: "items.product",
    select:
      "_id name variants price brand category subCategory gender seasonality ratings",
  },
  {
    path: "user",
    select: "_id name email role",
  },
  {
    path: "createdBy",
    select: "_id name email",
  },
  {
    path: "lastModifiedBy",
    select: "_id name email",
  },
];

//@desc Create an order
//@route POST /api/v1/orders
//@access Private
exports.create = exceptionHandler(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items?.length || !shippingAddress || !paymentMethod) {
    return next(new AppError("Invalid order creation pattern", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;

    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id).session(session);

        if (!product) {
          throw new AppError(`Product with ID ${item._id} not found`, 404);
        }

        const variant = product.variants.find(
          (v) =>
            v.size.toLowerCase() === item.size.toLowerCase() &&
            v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (!variant) {
          throw new AppError(
            `Variant with size ${item.size} and color ${item.color} not found for product ${product.name}`,
            400
          );
        }

        if (variant.stock < item.quantity) {
          throw new AppError(
            `Product ${product.name} (${item.size}/${item.color}) is out of stock. Available: ${variant.stock}`,
            400
          );
        }

        const price =
          product.price.sale && product.price.sale < product.price.base
            ? product.price.sale
            : product.price.base;

        const total = parseFloat((price * item.quantity).toFixed(2));
        totalAmount += total;

        variant.stock -= item.quantity;
        await product.save({ session });

        return {
          product: item._id,
          variant: {
            size: item.size,
            color: item.color,
            image: variant.images[0],
          },
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
      notes,
      summary: {
        totalItems: validatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        uniqueItems: validatedItems.length,
        averageItemPrice: parseFloat(
          (
            totalAmount /
            validatedItems.reduce((sum, item) => sum + item.quantity, 0)
          ).toFixed(2)
        ),
      },
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
    });

    const savedOrder = await order.save({ session });
    await session.commitTransaction();

    const populatedOrder = await Order.findById(savedOrder._id).populate(
      defaultPopulateOptions
    );

    res.status(201).json({
      status: "success",
      data: populatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

//@desc Get all orders
//@route GET /api/v1/orders
//@access Private/Admin
exports.getAll = exceptionHandler(async (req, res, next) => {
  const { data, pagination } = await paginate(
    Order,
    req.query,
    {},
    defaultPopulateOptions
  );

  if (!data) {
    return next(new AppError("No orders found", 404));
  }

  res.status(200).json({
    status: "success",
    pagination,
    data,
  });
});

//@desc Get all orders of logged in user
//@route GET /api/v1/orders
//@access Private
exports.getAllMine = exceptionHandler(async (req, res, next) => {
  const { _id } = req.user._doc;
  const filters = { ...req.query, user: _id };

  const { data, pagination } = await paginate(
    Order,
    filters,
    {},
    defaultPopulateOptions
  );

  if (!data) {
    return next(new AppError("No orders found", 404));
  }

  res.status(200).json({
    status: "success",
    pagination,
    data,
  });
});

//@desc Get a single order
//@route GET /api/v1/orders/:id
//@access Private
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate(defaultPopulateOptions);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//@desc Update a single order
//@route PATCH /api/v1/orders/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (!order.canBeModified()) {
    return next(new AppError("This order cannot be modified", 400));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  ).populate(defaultPopulateOptions);

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc Delete a single order
//@route DELETE /api/v1/orders/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (order.orderStatus !== "Cancelled") {
    return next(new AppError("Only cancelled orders can be deleted", 400));
  }

  await order.deleteOne();

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//@desc Update the payment status of order
//@route PATCH /api/v1/orders/:id/payment
//@access Private/Admin
exports.updatePaymentStatus = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return next(new AppError("Payment status not valid", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (order.orderStatus === "Cancelled") {
    return next(
      new AppError("Cannot update payment status of cancelled order", 400)
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      paymentStatus,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc Update the order status
//@route PATCH /api/v1/orders/:id/order/status
//@access Private/Admin
exports.updateOrderStatus = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return next(new AppError("Order status not valid", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (!order.canBeModified()) {
    return next(new AppError("Order status cannot be modified", 400));
  }

  if (
    order.orderStatus === "Pending" &&
    !["Processing", "Cancelled"].includes(orderStatus)
  ) {
    return next(new AppError("Invalid status transition from Pending", 400));
  }

  if (orderStatus === "Cancelled" && !order.canBeCancelled()) {
    return next(
      new AppError("Invalid status transition, order can't be cancelled", 400)
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  ).populate(defaultPopulateOptions);

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
