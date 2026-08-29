const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const prescriptionService = require("../services/prescriptionService");

const listPrescriptions = asyncHandler(async (req, res) => {
  const result = await prescriptionService.listPrescriptions(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listPrescriptions,
};
