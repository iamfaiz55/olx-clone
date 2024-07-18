const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const cookieparser = require("cookie-parser")
// const { adminProtected } = require("./middleware/adminProtected")
require("dotenv").config()



mongoose.connect(process.env.MONGO_URL)
const app = express()
app.use(express.json())
app.use(express.static("dist"))
// app.use(express.static("public"))
app.use(cors({
    origin: process.env.NODE_ENV === "development"
    ?process.env.LIVE_SERVER
    :"http://localhost:5173",
    credentials:true
}))
app.use(cookieparser())


// app.use("/api/skillhub/student", require("./routes/user.routes"))
// app.use("/api/skillhub/auth", require("./routes/admin.auth.route"))
// app.use("/api/skillhub",adminProtected, require("./routes/admin.routes"))

app.use("*", (req, res)=> {
    // res.sendFile(path.join(__dirname,"public","index.html"))
    res.status(404).json({message:"Resoure Not Found"})
})

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({message:"Something went wrong"})
})

mongoose.connection.once("open", ()=>{
    console.log("MONGO CONNECTED");
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})