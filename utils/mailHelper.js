const nodemailer = require("nodemailer");
const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS} = process.env
 const mailhelper = async(options) =>{
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

    // send mail with defined transport object
    const message = {
      from: "adityaofficial@1022004@gmail.com", // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.message, // plain text body
    };
    await transporter.sendMail(message)
 
 
};

module.exports = mailhelper;
