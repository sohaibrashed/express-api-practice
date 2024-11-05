const jwt = require("jsonwebtoken");

exports.generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};
