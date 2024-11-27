const jwt = require("jsonwebtoken");

exports.generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  return token;
};
