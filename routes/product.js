const express = require("express")
const { addProduct, getAllProducts, adminGetAllProducts, getOneProduct, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview } = require("../controller/productController")
const router = express.Router()
const{isLoggedIn,customUser} = require("../middleware/user")

// user routes
router.route("/products").get(getAllProducts)
router.route("/product/:id").get(getOneProduct)
router.route("/review/").put(isLoggedIn , addReview).delete(isLoggedIn , deleteReview)




// admin routes
router.route("/admin/product/add").post(isLoggedIn,customUser("admin"),addProduct)
router.route("/admin/products").get(isLoggedIn,customUser("admin"),adminGetAllProducts)
router.route("/admin/product/:id").put(isLoggedIn,customUser("admin"),adminUpdateOneProduct).delete(isLoggedIn,customUser("admin"),adminDeleteOneProduct)


module.exports = router