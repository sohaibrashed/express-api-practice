const User = require("../models/user");
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      const error = new Error("No token found");
      error.statusCode = 401;
      throw error;
    }
    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user._id) {
      const error = new Error("User not Found");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.checkSignin = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (token) {
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        throw new Error("User already logged in");
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
        (req.baseUrl === "/api/v1/users" && req.route.path === "/:id") ||
        req.method === "DELETE"
      ) {
        if (req.user.role === "admin") {
          const id = req.params.id;

          const checkUser = await User.findById(id);

          if (!checkUser) {
            const error = new Error(`user with this ID: ${id} doesn't exist`);
            error.statusCode = 401;
            throw error;
          }

          if (checkUser.role !== "user") {
            const error = new Error("Not Authorized");
            error.statusCode = 401;
            throw error;
          }
        }
      }
      next();
    } else {
      const error = new Error(`Role: ${req.user.role} is not Authorized`);
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
