const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const invoiceService = require("../services/invoiceService");

const listInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.listInvoices(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

module.exports = {
  listInvoices,
};
