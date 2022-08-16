const User = require("../models/User");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customErrors");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const mailhelper = require("../utils/mailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return next(new Error("please send email", 400));
  }

  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("all fields are required"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("user does not exist", 400));
  }
  const isCorrectPassword = await user.IsValidatedPassword(password);
  if (!isCorrectPassword) {
    return next(new CustomError("password does not match", 400));
  }
  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: "true",
    message: "logged out",
  });
});

exports.forgotpassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("user does not exist", 404));
  }
  const forgotToken = user.getForgotToken();

  await user.save({ validateBeforeSave: false });
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `copy paste this url in your browser \n\n  ${myUrl}`;

  try {
    await mailhelper({
      email: user.email,
      subject: "Interiors- password reset request",
      message,
    });
    res.status(200).json({
      success: true,
      message: "email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});
exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("token is invalid or expired", 400));
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new CustomError("fields do not match", 400));
  }

  user.password = req.body.password;
  await user.save();
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new CustomError("not logger in"), 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");
  const isCorrectOldPassword = await user.IsValidatedPassword(
    req.body.oldPassword
  );
  if (!isCorrectOldPassword) {
    return next(new CustomError("old password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();

  cookieToken(user, res);
});
exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.files) {
    const user = await User.findById(req.user.id);
    const imageId = user.photo.id;
    // deleting previous image from the database
    const resp = await cloudinary.v2.uploader.destroy(imageId);

    // updating image
    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});
exports.adminGetOneUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
});
exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user
  });
});
exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  const imageId = user.photo.id;
  // deleting previous image from the database
  const resp = await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();
  res.status(200).json({
    success: true,
    
  });
});

