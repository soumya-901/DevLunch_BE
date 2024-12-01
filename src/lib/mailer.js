const nodemailer = require("nodemailer");
const { generateOTP } = require("./stringManupulator");

// Gmail service setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "lipuparhi008@gmail.com",
    pass: "ggtobsgjmwpzwkpx",
  },
});

exports.sentOtp = async ({ receiverEmail, receiverName }) => {
  try {
    let otp = generateOTP();
    console.log("sending otp to ", receiverEmail);
    await transporter.sendMail({
      from: "no-reply@gmail.com", // Sender
      to: receiverEmail, // Recipient
      subject: "Verify Otp", // Subject
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`, // Plain text
      html: `<h1> Hi ${receiverName} ,
       Your OTP is: <strong>${otp}</strong></h1>
       <p>This code will expire in 5 minutes.</p>`, // HTML content
    });
    console.log("Otp sent successfully to ", receiverEmail);
    return {
      status: true,
    };
  } catch (error) {
    console.log("error ", error);
    throw error;
  }
};
