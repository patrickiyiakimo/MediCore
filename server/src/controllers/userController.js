const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");

const userService = require("../services/userService");

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return success(res, httpStatus.OK, messages.OK, user);
});

module.exports = {
  listUsers,
  updateUserRole,
};
