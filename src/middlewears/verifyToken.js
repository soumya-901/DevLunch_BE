const jwt = require("jsonwebtoken");
const { prisma } = require("../../prisma");
const { isEmpty } = require("../lib/stringManupulator");
const { userCache } = require("../global/constants");

/**
 * Middleware to verify JWT token and check user validity.
 */
async function verifyToken(req, res, next) {
  // Get the token from cookies
  const token = req?.headers?.cookie?.split("=")?.[1];
  if (isEmpty(token)) {
    console.log(token);
    return res
      .status(401)
      .json({ message: "Unauthorized access: No token provided" });
  }

  try {
    // const clientIP =
    //   req?.headers["x-forwarded-for"] || // Checks for forwarded IP from proxy
    //   req?.connection.remoteAddress || // Standard remote IP
    //   req?.socket.remoteAddress;
    // console.log("client ip - ", clientIP);
    // Verify the JWT token

    const userDetails = jwt.verify(token, global.JWT_SECRET);

    // Extract email from the userDetails token
    const { email } = userDetails;
    console.log("email   ", email);

    if (!email) {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Email not found in token" });
    }
    console.log("userCache", userCache);
    // Check if email exists in the cache
    if (userCache[email]) {
      res.locals = { userDetails: userCache[email] }; // Attach email to request object
      return next(); // User is authenticated
    }

    // Check if user exists in the database using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        admin: true,
        updatedAt: true,
      },
    });
    console.log("user from fetch ", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access: User not found" });
    }

    // Cache the email in memory for future requests
    userCache[email] = userDetails;

    // Attach email to the request object
    res.locals = { userDetails: userDetails };

    return next(); // Proceed to the next middleware
  } catch (err) {
    // Handle token verification errors
    console.log("error ", err);
    return res
      .status(401)
      .json({ message: "Unauthorized access: Invalid or expired token" });
  }
}

module.exports = { verifyToken };
