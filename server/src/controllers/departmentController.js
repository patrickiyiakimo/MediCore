const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const departmentService = require("../services/departmentService");

const listDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentService.listDepartments();
  return success(res, httpStatus.OK, messages.OK, { data: departments });
});

module.exports = {
  listDepartments,
};
