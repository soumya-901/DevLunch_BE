const crypto = require("node:crypto");

// Function to hash a password
const hashPassword = (
  password,
  salt = crypto.randomBytes(16).toString("hex")
) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hashedPassword };
};

// Function to verify a password
const verifyPassword = (password, hash, salt) => {
  const { hashedPassword } = hashPassword(password, salt);
  return hashedPassword === hash;
};

module.exports = {
  verifyPassword,
  hashPassword,
};
