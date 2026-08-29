const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const staffService = require("../services/staffService");

const listStaff = asyncHandler(async (req, res) => {
  const result = await staffService.listStaff(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listStaff,
};
