const express = require("express")
const { createOrder, getOneOrder, getLoggedInOrders, adminGetOrders, adminUpdateOrder, adminDeleteOrder } = require("../controller/orderController")
const router = express.Router()
const{isLoggedIn ,customUser} = require("../middleware/user")

router.route("/order/create").post(isLoggedIn ,createOrder)
router.route("/order/:id").get(isLoggedIn ,getOneOrder)
router.route("/myorders/").get(isLoggedIn ,getLoggedInOrders)

// admin routes
router.route("/admin/orders").get(isLoggedIn , customUser("admin") ,adminGetOrders)
router.route("/admin/order/:id").put(isLoggedIn , customUser("admin") ,adminUpdateOrder)
.delete(isLoggedIn , customUser("admin") ,adminDeleteOrder)





module.exports =router