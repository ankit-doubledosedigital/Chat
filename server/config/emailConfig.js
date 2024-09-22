const nodemailer = require('nodemailer');
// const http = require('http')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure:true,
  auth: {
      user: 'moreinfotalknexus@gmail.com',
      pass: 'fkfzdcppjgsznqte'
  }
});

module.exports = transporter;
