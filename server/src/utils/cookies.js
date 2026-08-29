const time = require("../constants/time");

/**
 * Builds HttpOnly cookie options shared by access/refresh tokens.
 */
const baseCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge,
});

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const accessCookieOptions = () =>
  baseCookieOptions(time.ACCESS_TOKEN_MS);

const refreshCookieOptions = (rememberMe) =>
  baseCookieOptions(
    rememberMe ? time.REMEMBER_REFRESH_TOKEN_MS : time.REFRESH_TOKEN_MS
  );

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

module.exports = {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  clearCookieOptions,
};
