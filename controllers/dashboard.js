const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const exceptionHandler = require("../middlewares/exceptionHandler");

//@desc Get dashboard data
//@route GET /api/v1/dashboard/
//@access Private/Admin
exports.getDashboardData = exceptionHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const [totalUsers, totalProducts, totalOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(dateFilter),
  ]);

  const revenueData = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Completed",
        ...(startDate || endDate ? { createdAt: dateFilter } : {}),
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const revenueTrends = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Completed",
        ...(startDate || endDate ? { createdAt: dateFilter } : {}),
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        monthlyRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const orderTrends = await Order.aggregate([
    { $match: { ...(startDate || endDate ? { createdAt: dateFilter } : {}) } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        monthlyOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userGrowthTrends = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        monthlySignups: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const categorySales = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$productDetails.category",
        totalSales: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] },
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $project: {
        _id: 0,
        category: "$categoryDetails.name",
        totalSales: 1,
        totalRevenue: 1,
      },
    },
  ]);

  const popularBrands = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$productDetails.brand",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, brand: "$_id", totalSold: 1 } },
  ]);

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
      revenueTrends,
      orderTrends,
      userGrowthTrends,
      topSellingProducts,
      recentOrders,
      lowStockProducts,
      ordersByStatus,
      categorySales,
      popularBrands,
    },
  });
});
