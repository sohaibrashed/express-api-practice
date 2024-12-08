exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log({
    status: "fail",
    statusCode,
    message: err.message || "Server error",
    details: err.details || null,
    stack:
      process.env.NODE_ENV !== "production" && err.stack
        ? err.stack.split("\n").map((line) => line.trim())
        : undefined,
  });
  res.status(statusCode).json({
    status: "fail",
    statusCode,
    message: err.message || "Server error",
    details: err.details || null,
    stack:
      process.env.NODE_ENV !== "production" && err.stack
        ? err.stack.split("\n").map((line) => line.trim())
        : undefined,
  });
};
