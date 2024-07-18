const asyncHandler = require("express-async-handler")
const validator = require("validator")

exports.registerAdmin == asyncHandler((req, res)=> {
    const {name, email, password}= req.body
    if(validator.isEmpty(name)){
        return res.status(400).json({message:"Name Is Required"})
    }
    if(validator.isEmpty(email)){
        return res.status(400).json({message:"Email Is Required"})
    }
    if(validator.isEmpty(passsword)){
        return res.status(400).json({message:"Passsword Is Required"})
    }
})