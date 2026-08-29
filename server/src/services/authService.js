const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const messages = require("../constants/messages");
const bcrypt = require("bcryptjs");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const env = require("../config/env");

const SALT_ROUNDS = 10;

/**
 * Business logic for authentication.
 */
const register = async (payload) => {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw ApiError.conflict(messages.USER_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const created = await userRepository.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
  });

  return {
    id: created.id,
    firstName: created.first_name,
    lastName: created.last_name,
    email: created.email,
    role: created.role,
  };
};

const login = async (email, password, rememberMe) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw ApiError.unauthorized(messages.INVALID_CREDENTIALS);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw ApiError.unauthorized(messages.INVALID_CREDENTIALS);
  }

  const accessToken = signAccessToken({ id: user.id });
  const refreshToken = signRefreshToken(
    { id: user.id },
    rememberMe ? "30d" : env.refreshExpiresIn
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized(messages.REFRESH_TOKEN_MISSING);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.forbidden(messages.REFRESH_TOKEN_INVALID);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized(messages.NOT_AUTHORIZED);
  }

  return signAccessToken({ id: user.id });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};
