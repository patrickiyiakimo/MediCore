const errorCodes = require("../constants/errorCodes");

/**
 * Domain error carrying an HTTP status and machine-readable code.
 */
class ApiError extends Error {
  constructor(status, message, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code || "ERROR";
    this.details = details || {};
    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message, details) {
    return new ApiError(
      400,
      message,
      errorCodes.VALIDATION_ERROR,
      details
    );
  }

  static unauthorized(message) {
    return new ApiError(401, message, errorCodes.UNAUTHORIZED);
  }

  static forbidden(message) {
    return new ApiError(403, message, errorCodes.FORBIDDEN);
  }

  static notFound(message) {
    return new ApiError(404, message, errorCodes.NOT_FOUND);
  }

  static conflict(message) {
    return new ApiError(409, message, errorCodes.CONFLICT);
  }
}

module.exports = ApiError;
