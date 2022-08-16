const BigPromise = require("../middleware/bigPromise");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
exports.sendStripeKey = BigPromise(async (req,res,next)=>{
    res.status(200).json({
        success:true,
        stripekey:process.env.STRIPE_PUBLISHABLE_KEY
    })
})
exports.captureStripePayment = BigPromise(async (req,res,next)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.status(200).json({
        success:true,
        client_secret:paymentIntent.client_secret
      })
})