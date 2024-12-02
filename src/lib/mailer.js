const nodemailer = require("nodemailer");
const { generateOTP } = require("./stringManupulator");
const { prisma } = require("../../prisma");

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

exports.verifyotp = async ({ email, otp }) => {
  try {
    // Check if OTP exists in the database
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        otp,
      },
    });

    if (otpRecord) {
      // OTP found and valid
      console.log("Login successful for:", email);

      // Optionally, delete the OTP after successful verification
      await prisma.otp.deleteMany({
        where: {
          email,
        },
      });

      return { success: true, message: "Login successful" };
    } else {
      // OTP not found or expired
      return { success: false, message: "Invalid or expired OTP" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "An error occurred" };
  }
};

exports.sentOtp = async ({ receiverEmail, receiverName }) => {
  try {
    let otp = generateOTP();
    await prisma.otp.create({
      data: {
        email: receiverEmail,
        otp,
      },
    });
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
