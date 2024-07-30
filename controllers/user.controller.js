const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { checkEmpty } = require("../utils/checkEmpty");
const User = require("../models/User");


exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const { isError, error } = checkEmpty({ email, otp });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    const result = await User.findOne({ email });

    if (!result) {
        return res.status(400).json({ message: "Admin not found with this email" });
    }

    if (result.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
  await User.findByIdAndUpdate(result._id, {emailVerified:true})
    res.json({
        message: "Email Verified Success"
     
    });
});
exports.verifyMobileOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const { isError, error } = checkEmpty({ email, otp });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    const result = await User.findOne({ email });

    if (!result) {
        return res.status(400).json({ message: "Admin not found with this email" });
    }

    if (result.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
  await User.findByIdAndUpdate(result._id, {emailVerified:true})
    res.json({
        message: "Email Verified Success"
    });
});