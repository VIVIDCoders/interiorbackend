const app = require("./app")
const connectWithDB = require("./config/db")
const cloudinary = require("cloudinary")
const {PORT,CLOUDINARY_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} = process.env
require('dotenv').config()

// db connection
connectWithDB()

// cloudinary config
cloudinary.config({
    cloud_name:CLOUDINARY_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
})


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT} `);
})