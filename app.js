require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const sanitize = require("express-mongo-sanitize");
// const xss = require("xss");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const categoryRouter = require("./routes/category");
const brandRouter = require("./routes/brand");
const reviewRouter = require("./routes/review");
const favoriteRouter = require("./routes/favorite");
const dashboardRouter = require("./routes/dashboard");
const otpRouter = require("./routes/OTP");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  console.info(`Node Env: ${process.env.NODE_ENV}`);
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
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/otp", otpRouter);

app.all("*", (req, res, next) => {
  next(new Error(`this ${req.path} URL, NOT FOUND`));
});

app.use(errorHandler);

module.exports = app;
