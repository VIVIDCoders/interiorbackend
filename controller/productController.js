const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customErrors");
const Product = require("../models/Product");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = BigPromise(async (req, res, next) => {
  let imageArray = [];
  if (!req.files.photos) {
    return next(new CustomError("please send image(s)", 401));
  }
  if (req.files.photos) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultsPerPage = 6;

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  let products = await productsObj.base;

  const filteredProductNumber = products.length;

  productsObj.pager(resultsPerPage);
  products = await productsObj.base.clone();
  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("cannot find any product with this id", 401));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, productId, comment } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const AlreadyReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (AlreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // save
  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
exports.deleteReview = BigPromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

    const numberOfReviews = reviews.length;
    
    // update
    await Product.findByIdAndUpdate(productId,{
      reviews,
      numberOfReviews,
      ratings
    },{
      new:true,
      runValidators:true
    })

  res.status(200).json({
    success: true,
  });
});

// admin only controller
exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  let imageArray = [];
  if (!product) {
    return next(new CustomError("cannot find any product with this id", 401));
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(req.files.photos[index].id);
    }
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imageArray;
  product = await Product.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    success: true,
    product,
  });
});
exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("cannot find any product with this id", 401));
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(req.files.photos[index].id);
    }
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "product was deleted !!",
  });
});
exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
