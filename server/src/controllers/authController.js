const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const messages = require("../constants/messages");
const httpStatus = require("../constants/httpStatus");

const authService = require("../services/authService");

const {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  clearCookieOptions,
} = require("../utils/cookies");

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return success(
    res,
    httpStatus.CREATED,
    messages.USER_CREATED,
    user
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, remember_me } = req.body;

  const { accessToken, refreshToken, user } = await authService.login(
    email,
    password,
    remember_me
  );

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions());
  res.cookie(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    refreshCookieOptions(remember_me)
  );

  return success(res, httpStatus.OK, messages.LOGIN_SUCCESS, user);
});

const refreshToken = asyncHandler(async (req, res) => {
  const newAccessToken = await authService.refreshAccessToken(
    req.cookies[REFRESH_TOKEN_COOKIE]
  );

  res.cookie(
    ACCESS_TOKEN_COOKIE,
    newAccessToken,
    accessCookieOptions()
  );

  return success(res, httpStatus.OK, messages.TOKEN_REFRESHED);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions());
  res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions());
  return success(res, httpStatus.OK, messages.LOGOUT_SUCCESS);
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
