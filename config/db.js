const mongoose = require('mongoose')

const connectWithDB = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(console.log('CONNECTED SUCCESSFULLY'))
    .catch(error =>{
    console.log("Error conneting the database", error),
    process.exit(1)})
}
module.exports = connectWithDB