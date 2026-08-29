const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const admissionService = require("../services/admissionService");

const listAdmissions = asyncHandler(async (req, res) => {
  const result = await admissionService.listAdmissions(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listAdmissions,
};
