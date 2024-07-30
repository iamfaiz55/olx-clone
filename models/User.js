const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    avatar:{type:String, default:"https://res.cloudinary.com/dpc5d15ci/image/upload/v1721291386/m2i8d3i8N4d3N4K9_rzvcsp.png"},
    password:{type:String, required:true},
    emailVerified:{type:Boolean, default:false},
    mobileVerified:{type:Boolean, default:false},
    isDeleted:{type:Boolean, default:false},
    mobile:{type:Number, required:true},
    active:{type:Boolean, default:true},
    emailCode:{type:String},
    mobileCode:{type:String},
},{timestamps:true})

module.exports = mongoose.model("user", userSchema)