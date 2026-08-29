const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");

const userService = require("../services/userService");

const listUsers = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const result = await userService.listUsers({ limit, offset });
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listUsers,
};
