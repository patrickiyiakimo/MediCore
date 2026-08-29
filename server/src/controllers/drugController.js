const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const drugService = require("../services/drugService");

const listDrugs = asyncHandler(async (req, res) => {
  const result = await drugService.listDrugs(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

const createDrug = asyncHandler(async (req, res) => {
  const drug = await drugService.createDrug(req.body);
  return success(res, httpStatus.CREATED, messages.OK, drug);
});

module.exports = {
  listDrugs,
  createDrug,
};
