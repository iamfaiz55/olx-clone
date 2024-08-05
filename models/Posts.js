const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
   title:{
    type:String,
    required:true
   },
   desc:{
    type:String,
    required:true
   },
   price:{
    type:Number,
    required:true
   },
   images:{
    type:[String],
    required:true
   },
   location:{
    type:String,
    required:true
   },
   category:{
    type:String,
    required:true
   },
   user:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"user"
   },
   // gps:{
   //    type:Boolean,
   //    default:false
   // }
},{timestamps:true})

module.exports = mongoose.model("posts", postSchema)