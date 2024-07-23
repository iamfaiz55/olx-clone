const authController = require("../controllers/auth.controller")

const router = require("express").Router()
// const authControllers = require("./../controllers/auth.controller")

router
      .post("/register-admin", authController.registerAdmin )
      .post("/login-admin", authController.loginAdmin )
      .post("/verify-otp", authController.verifyOTP )

module.exports = router