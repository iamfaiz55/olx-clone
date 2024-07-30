// admin register
// admin verify otp
// admin login
// admin logout

// user register
// user verify email
// user login
// user logout

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../utils/checkEmpty")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")
const User = require("../models/User")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })

    res.json({ message: "Register Success" })
})

exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })

    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid Email" : "Invalid Credentials" })
    }
    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid Password" : "Invalid Credentials" })
    }

    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)

    await Admin.findByIdAndUpdate(result._id, { otp })

    await sendEmail({
        to: email,
        subject: `Login OTP`,
        message: `
            <h1>Do Not Share Your Account OTP</h1>
            <p>your login otp ${otp}</p>
        ` })

    res.json({ message: "Credentials Verify Success. OTP send to your registered email." })
})

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }

    const result = await Admin.findOne({ email })

    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid Email" : "Invalid Credentials" })
    }

    if (otp !== result.otp) {

        return res.status(401).json({ message: "Invalid OTP" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    // JWT
    res.cookie("admin", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    // Cookie
    res.json({
        message: "OTP Verify Success.", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })

    // Res


})

exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Logout Success" })
})



exports.registerUser = asyncHandler(async (req, res) => {
    const { name, mobile, email, password, cpassword } = req.body

    const { error, isError } = checkEmpty({
        name, mobile, email, password, cpassword
    })
    if (isError) { return res.status(400).json({ message: "All fields required", error }) }
    if (!validator.isEmail(email)) { return res.status(400).json({ message: "Invalid email" }) }
    if (!validator.isMobilePhone(mobile, "en-IN")) { return res.status(400).json({ message: "Invalid Mobile", }) }
    if (!validator.isStrongPassword(password)) { return res.status(400).json({ message: "Provide Strong Password", }) }
    if (!validator.isStrongPassword(cpassword)) { return res.status(400).json({ message: "Provide Strong Confirm Password", }) }
    if (password !== cpassword) { return res.status(400).json({ message: "Password Do not match", }) }

    const result = await User.findOne({ email })
    if (result) {
        res.status(400).json({ message: "email Already registered with us", })
    }

    const hash = await bcrypt.hash(password, 10)

    await User.create({ name, mobile, email, password: hash })

    res.json({ message: "User Register Success" })

})
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password })
    if (isError) { return res.status(400).json({ message: "All fields required", error }) }

    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email Not Found" })
    }

    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "Password Do Not Match" })
    }

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "180d" })

    res.cookie("user", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 180
    })
    res.json({
        message: "User Register Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            avatar: result.avatar,
            emailVerified: result.emailVerified,
            mobileVerified: result.mobileVerified,
        }
    })
})
exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "User Logout Success" })
})