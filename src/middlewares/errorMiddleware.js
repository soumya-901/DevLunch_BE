// Error-Handling Middleware
const handleErrors = (err, req, res, next) => {
  // Log the error (optional)
  console.error(`[Error] ${err.message}`);

  // Set the HTTP status code (default to 500 if not set)
  const statusCode = err.status || 500;

  // Respond with a JSON error object
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
};
module.exports = {
  handleErrors,
};
