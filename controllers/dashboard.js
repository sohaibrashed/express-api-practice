const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.getDashboardData = exceptionHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "Completed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const topSellingProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 0,
        name: "$productDetails.name",
        totalSold: 1,
        price: "$productDetails.price",
      },
    },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("user totalAmount orderStatus createdAt")
    .populate("user", "name email");

  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select("name stock")
    .limit(5);

  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      topSellingProducts,
      recentOrders,
      lowStockProducts,
      ordersByStatus,
    },
  });
});
