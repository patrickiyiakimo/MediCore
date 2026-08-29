const ApiError = require("../utils/ApiError");
const errorCodes = require("../constants/errorCodes");

/**
 * Central error-handling middleware.
 * Formats errors into the standard response envelope.
 */
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      code: err.code,
      status: err.status,
      details: err.details,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: errorCodes.UNAUTHORIZED,
      status: 401,
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON body",
      code: errorCodes.VALIDATION_ERROR,
      status: 400,
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: errorCodes.INTERNAL_SERVER_ERROR,
    status: 500,
  });
};

module.exports = errorHandler;
