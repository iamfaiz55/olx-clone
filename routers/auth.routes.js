const authController = require("../controllers/auth.controller")

const router = require("express").Router()
// const authControllers = require("./../controllers/auth.controller")

router
      .post("/register-admin", authController.registerAdmin )
      .post("/login-admin", authController.loginAdmin )
      .post("/verify-otp", authController.verifyOTP )

      .post("/register-admin", authController.registerUser )
      .post("/login-user", authController.loginUser )
      .post("/verify-otp-user", authController.verifyOTPUser )

module.exports = router