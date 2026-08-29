/**
 * Shared message templates used across services and controllers.
 */
module.exports = {
  OK: "Request successful",
  REQUIRED_FIELDS: "All required fields must be provided",
  INVALID_CREDENTIALS: "Invalid email or password",

  PASSWORD_MISMATCH: "Invalid email or password",
  USER_EXISTS: "User already exists",
  USER_CREATED: "User registered successfully",
  USER_NOT_FOUND: "User not found",

  LOGIN_SUCCESS: "User logged in successfully",
  LOGOUT_SUCCESS: "User logged out successfully",
  TOKEN_REFRESHED: "Access token refreshed",
  REFRESH_TOKEN_MISSING: "Refresh token missing",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",

  NOT_AUTHORIZED: "Not authorized to access this resource",
  RATE_LIMITED: "Too many requests, please try again later",
};
