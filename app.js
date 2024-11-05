require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { loggerHandler } = require("./middlewares/logger");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  // app.use(loggerHandler);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
// app.get("/api/v1/error", (req, res) => {
//   throw new Error("Test error");
// });

app.use(errorHandler);

module.exports = app;
