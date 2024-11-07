exports.errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "fail",
    code: err.statusCode,
    error: err.message || "Server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : "production",
  });
};
