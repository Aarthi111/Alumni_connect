const nodemailer = require('nodemailer')

const sendEmail = async(to,otp)=>{
    const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})

await transporter.sendMail({
    from:process.env.EMAIL,
    to,
    subject: 'Alumni Connect - Email Verification',
    html: `
      <h2>Verify your email</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes only</p>
    `
  
})
}

module.exports = sendEmail