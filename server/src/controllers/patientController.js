const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const patientService = require("../services/patientService");

const listPatients = asyncHandler(async (req, res) => {
  const result = await patientService.listPatients(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatient(req.params.id);
  return success(res, httpStatus.OK, messages.OK, patient);
});

const createPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient(req.body);
  return success(res, httpStatus.CREATED, messages.USER_CREATED, patient);
});

module.exports = {
  listPatients,
  getPatient,
  createPatient,
};
