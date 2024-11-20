exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    statusCode,
    error: err.message || "Server error",
    details: err.details || null,
    stack:
      process.env.NODE_ENV === "development" && err.stack
        ? err.stack.split("\n").map((line) => line.trim())
        : undefined,
  });
};
