const jwt = require("jsonwebtoken");

// Generate a JWT token
function generateToken(userDetails) {
  const token = jwt.sign(userDetails, global.JWT_SECRET, { expiresIn: "1h" }); // 1 hour expiration

  return token;
}

module.exports = {
  generateToken,
};
