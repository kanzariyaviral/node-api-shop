

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viralgtcsys@gmail.com',
    pass: 'ViralG@123'
  }
});

let mailOptions = {
  from: 'viralgtcsys@gmail.com',
  to: 'dharmesh.kanzariya23@gmail.com',
  subject: 'create account ',
  text: `you are create account in nodejs-api-shop`
};

transporter.sendMail(mailOptions,(error, info)=>{
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});