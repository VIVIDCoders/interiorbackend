const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    maxlength: [120, "Product name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a product price"],
    maxlength: [7, "Product name should not be more than 7 digits"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  photos: [
    {
      id: {
        type: String,

        required: true,
      },
      secure_url: {
        type: String,

        required: true,
      },
    },
  ],
  stock:{
    type:Number,
    required:true
  },
  category: {
    type: String,
    required: [true, "please select category from - table , chair & couch "],
    enum: {
      values: ["table", "chair", "couch"],
      message: "please select category ONLY from - table , chair & couch"
    }
    },
    brand: {
      type: String,
      required: [true, "please provide a brand"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },
        rating:{
            type:String
        },
        comment:{
            type:String,
            required:true
        }

      },
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
  
});

module.exports = mongoose.model("Product", productSchema);
