require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const home = require("./routes/home");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const user = require('./routes/user');
const product  = require("./routes/product");
const payment  = require("./routes/payment");
const order  = require("./routes/order");



// morgan middleware 
app.use(morgan("tiny"));

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    next();
  
  })

//cookies and files
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))




app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1",order);





module.exports = app;
