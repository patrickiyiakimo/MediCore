const rateLimit = require("express-rate-limit");
const messages = require("../constants/messages");
const errorCodes = require("../constants/errorCodes");

/**
 * Per-IP rate limiting middleware.
 * Default window: 1 minute, max 100 requests per IP.
 */
const createRateLimiter = (options = {}) =>
  rateLimit({
    windowMs: options.windowMs || 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      message: options.message || messages.RATE_LIMITED,
      code: errorCodes.RATE_LIMITED,
      status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

module.exports = createRateLimiter;
