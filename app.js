require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.all("*", (req, res, next) => {
  next(new Error(`this ${req.path} URL, NOT FOUND`));
});

app.use(errorHandler);

module.exports = app;
