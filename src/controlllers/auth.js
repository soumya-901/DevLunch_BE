const { prisma } = require("../../prisma");
const { hashPassword, verifyPassword } = require("../lib/security");
const { isEmpty } = require("../lib/stringManupulator");
const { generateToken } = require("../lib/jwtToken");
const { sentOtp } = require("../lib/mailer");

// Sign Up Module
async function signUp(req, res) {
  const { name, email, password, address, admin } = req.body;
  try {
    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Hash the password
    const { salt, hashedPassword } = hashPassword(password);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        admin: admin || false,
        salt, // Store the salt in the database
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Sign In Module
async function signIn(req, res) {
  const { email, password } = req.body;
  console.log("payload ", req.body);
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("user details ", user);
    if (isEmpty(user)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the password
    const isPasswordValid = verifyPassword(password, user.password, user.salt);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      admin: user.admin,
      updateat: user.updatedAt,
    });

    // Set token as a cookie
    res.cookie(global.COOKIE_NAME, token, {
      httpOnly: true, // Prevent JavaScript access to cookies
      secure: process.env.NODE_ENV === "production", // Send cookie over HTTPS only in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 7 days
    });

    // sentOtp({ receiverEmail: user.email, receiverName: user.name });
    return res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

//Sent Otp module
async function verifyotp(req, res) {
  const { email, otp } = req.body;

  // Save OTP to database
  await prisma.otp.create({
    data: {
      email,
      otp,
    },
  });
}

module.exports = {
  signUp,
  signIn,
  verifyotp,
};
