const jwt = require("jsonwebtoken");

// Generate a JWT token
function generateToken(payload, expiresIn = "1h") {
  const token = jwt.sign(payload, global.JWT_SECRET, { expiresIn }); // 1 hour expiration

  return token;
}

module.exports = {
  generateToken,
};
