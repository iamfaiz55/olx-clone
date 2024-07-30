const userController = require("../controllers/user.controller")
const { userPRotected } = require("../middleware/protected")

const router = require("express").Router()

router
    .post("verify-email-otp", userController.verifyEmailOTP)
    .post("verify-mobile-otp", userController.verifyMobileOTP)

    .post("/add-post", userPRotected, userController.addPost)


module.exports = router