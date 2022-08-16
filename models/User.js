const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should not exceed 40 characters"],
  },
  email: {
    type: String,
    required: [true, "provide an email"],
    validate: [validator.isEmail, "incorrect email format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "provide a Password"],
    select: false,
    minlength: [6, "password should be of atleast 6 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required:true
      
    },
    secure_url: {
      type: String,
      required:true
      
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.IsValidatedPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

userSchema.methods.getForgotToken = function() {
  const forgotToken = crypto.randomBytes(20).toString('hex')
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex")
    
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken

};
module.exports = mongoose.model("User", userSchema);
