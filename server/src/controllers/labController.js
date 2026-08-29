const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const labService = require("../services/labService");

const listLabRequests = asyncHandler(async (req, res) => {
  const result = await labService.listLabRequests(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listLabRequests,
};
