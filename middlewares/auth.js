const User = require("../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("../util/appError");

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

exports.protect = async (req, res, next) => {
  try {
    const token = await req.cookies?.jwt;

    if (!token) {
      next(new AppError("No token found", 401));
    }
    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user._id) {
      next(new AppError("No user found", 401));
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.checkSignin = async (req, res, next) => {
  try {
    const token = await req.cookies?.jwt;

    if (token) {
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        next(new Error("User already logged in", 400));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkAccess = async (req, res, next) => {
  try {
    if (req.user && req.user.role !== "user") {
      if (
        req.baseUrl === "/api/v1/users" &&
        req.route.path === "/:id" &&
        req.method === "DELETE"
      ) {
        if (req.user.role === "admin") {
          const id = req.params.id;

          const checkUser = await User.findById(id);

          if (!checkUser) {
            next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
          }

          if (checkUser.role !== "user") {
            next(new AppError("Not Authorized", 401));
          }
        }
      }
      next();
    } else {
      next(new AppError(`Role: ${req.user.role} is not Authorized`, 401));
    }
  } catch (error) {
    next(error);
  }
};

exports.requireVerifiedEmail = async (req, res, next) => {
  const user = req.user;

  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email to access this feature", 403)
    );
  }

  next();
};
