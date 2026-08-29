const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * JWT helpers for access and refresh token lifecycle.
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const signRefreshToken = (payload, expiresIn) =>
  jwt.sign(payload, env.refreshSecret, { expiresIn });

const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

const verifyRefreshToken = (token) => jwt.verify(token, env.refreshSecret);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
