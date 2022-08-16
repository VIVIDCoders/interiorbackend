const express = require("express")
const router = express.Router()
const { signup, login, logout, forgotpassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUsers, adminUpdateOneUserDetails, adminGetOneUserDetails, adminDeleteOneUser } = require("../controller/userController");
const {isLoggedIn, customUser} = require("../middleware/user")
router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotpassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userDashboard').get(isLoggedIn,getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn,changePassword)
router.route('/userDashboard/update').post(isLoggedIn,updateUserDetails)
//admin only routes
router.route('/admin/users').get(isLoggedIn, customUser("admin") ,adminAllUsers)
router.route('/admin/users/:id').get(isLoggedIn, customUser("admin") ,adminGetOneUserDetails)
router.route('/admin/users/:id').delete(isLoggedIn, customUser("admin") ,adminDeleteOneUser)





module.exports = router