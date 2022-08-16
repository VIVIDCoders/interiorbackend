const BigPromise = require('../middleware/bigPromise')

exports.home = BigPromise((req , res)=>{
    res.status(200).json({
        success:true,
        greetings:"hello from api"
    })
})

