const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcrypt")
const { checkEmpty } = require("../utils/checkEmpty")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const sendEmail = require("../utils/email")
const User = require("../models/User")

exports.registerAdmin =asyncHandler(async(req, res)=> {
    const {name, email, password}= req.body
     const {isError, error} = checkEmpty({name, email, password})
      if(isError === true){
          return res.status(400).json({message:"All Fields Required", error})
        }
     if(!validator.isEmail(email)){
          return res.status(400).json({message:"invalid Email"})
        }
        //  if(!validator.isStrongPassword(password)){
            //       return res.status(400).json({message:"Provide Strong Password"})
            //   }
     const isFound = await Admin.findOne({email})
     if(isFound){
         return res.status(400).json({message:"Email Already Registered With Us "})

     }
    const hash = await bcrypt.hash(password, 10)
   
    await Admin.create({name, email, password:hash})
     res.json({message:"Admin Register Success"})
})


exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { isError, error } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ message: "Invalid Credential - Email Not Found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Password Does Not Match" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    await sendEmail({
        to: email,
        subject: 'Login OTP',
        message: `<h1>Do Not Share Your Account OTP</h1><p>Your Login OTP is ${otp}</p>`
    });

    await Admin.findByIdAndUpdate(admin._id, { otp });

    res.status(200).json({ message: "OTP sent successfully", result: email });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const { isError, error } = checkEmpty({ email, otp });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    const result = await Admin.findOne({ email });
    console.log(result.otp != otp);
    console.log(result.otp , otp);
    if (!result) {
        return res.status(400).json({ message: "Admin not found with this email" });
    }

    if (result.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign(
        { userId: result._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_EXPIRY || "1d" }
    );

    res.cookie("admin", token, {
        maxAge: 86400000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production"
    });

    res.json({
        message: "Login Success",
        result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    });
});
exports.registerUser =asyncHandler(async(req, res)=> {
    const {name, email, password}= req.body
     const {isError, error} = checkEmpty({name, email, password})
      if(isError === true){
          return res.status(400).json({message:"All Fields Required", error})
        }
     if(!validator.isEmail(email)){
          return res.status(400).json({message:"invalid Email"})
        }

     const isFound = await User.findOne({email})
     if(isFound){
         return res.status(400).json({message:"Email Already Registered With Us "})

     }
    const hash = await bcrypt.hash(password, 10)
   
    await User.create({...req.body,  password:hash})
     res.json({message:"User Register Success"})
})


exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { isError, error } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid Credential - Email Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Password Does Not Match" });
    }

    await Admin.findByIdAndUpdate(user._id, { otp });

    res.status(200).json({ message: "User Login successfully", result:user });
});

exports.verifyOTPUser = asyncHandler(async (req, res) => {
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

    const token = jwt.sign(
        { userId: result._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_EXPIRY || "1d" }
    );

    res.cookie("user", token, {
        maxAge: 86400000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production"
    });

    res.json({
        message: "Login Success",
        result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            avatar: result.avatar,

        }
    });
});
exports.logoutUser = asyncHandler(async (req, res)=> {
    res.clearCookie("user")
    res.json({message:"User Logout Success"})
})