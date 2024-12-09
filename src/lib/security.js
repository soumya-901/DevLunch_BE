const fs = require("fs").promises;
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

/**
 * Deletes a file at the given path.
 *
 * @param {string} filePath - The path of the file to delete.
 * @returns {Promise<{ success: boolean, message: string }>} - A promise that resolves with the result.
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath); // Attempt to delete the file
    return {
      success: true,
      message: `File at '${filePath}' deleted successfully.`,
    };
  } catch (err) {
    // Check if the error is because the file does not exist
    if (err.code === "ENOENT") {
      return {
        success: false,
        message: `File at '${filePath}' does not exist.`,
      };
    }
    // Handle other errors
    return {
      success: false,
      message: `Error deleting file at '${filePath}': ${err.message}`,
    };
  }
};

module.exports = {
  verifyPassword,
  hashPassword,
  deleteFile,
};
