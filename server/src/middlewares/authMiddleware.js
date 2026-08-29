const ApiError = require("../utils/ApiError");
const messages = require("../constants/messages");
const { verifyAccessToken } = require("../utils/jwt");
const { ACCESS_TOKEN_COOKIE } = require("../utils/cookies");
const userRepository = require("../repositories/userRepository");

/**
 * Verifies the access token and attaches the current user to req.
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[ACCESS_TOKEN_COOKIE];
    if (!token) {
      throw ApiError.unauthorized(messages.NOT_AUTHORIZED);
    }

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized(messages.NOT_AUTHORIZED);
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticate;
