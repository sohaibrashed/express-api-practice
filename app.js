require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const sanitize = require("express-mongo-sanitize");
// const xss = require("xss");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());
app.use(sanitize());
app.use(hpp());
// app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new Error(`this ${req.path} URL, NOT FOUND`));
});

app.use(errorHandler);

module.exports = app;
