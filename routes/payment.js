const express = require("express")
const { sendStripeKey } = require("../controller/paymentController")
const { isLoggedIn } = require("../middleware/user")
const router = express.Router()

router.route("/stripekey").get(isLoggedIn ,sendStripeKey)
 
module.exports = router
