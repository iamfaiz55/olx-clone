const authController = require("../controllers/auth.controller")

const router = require("express").Router()
// const authControllers = require("./../controllers/auth.controller")

router
      .post("/register-admin", authController.registerAdmin )
      .post("/login-admin", authController.loginAdmin )
      .post("/verify-otp", authController.verifyOTP )

      .post("/register-mobile-user", authController.registerUser )
      .post("/login-mobile-user", authController.loginUser )
      .post("/verify-mobile-otp", authController.verifyOTPUser )

module.exports = router