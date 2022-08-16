const User = require("../models/User");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customErrors");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("please login"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

exports.customUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError("you are not allowed to get this source", 403)
      );
    }
    next();
  };
};
