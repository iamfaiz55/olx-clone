const userController = require("../controllers/user.controller")

const router = require("express").Router()

router
    .post("verify-email-otp", userController.verifyEmailOTP)
    .post("verify-mobile-otp", userController.verifyMobileOTP)



module.exports = router