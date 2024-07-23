const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name:{type:String, required:true},
    password:{type:String, required:true},
    unique:{type:Boolean, default:true},
    email:{type:String, required:true},
    otp:{type:Number},
},{timestamps:true})

module.exports = mongoose.model("admin", adminSchema)