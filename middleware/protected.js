const jwt = require("jsonwebtoken")
exports.userPRotected = (req, res, next)=>{
   const {user} = req.cookies
   if(!user){

   }
   jwt.verify(user, process.env.JWT_KEY, ()=> {})

}