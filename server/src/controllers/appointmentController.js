const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/ApiResponse");
const httpStatus = require("../constants/httpStatus");
const messages = require("../constants/messages");
const appointmentService = require("../services/appointmentService");

const listAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.listAppointments(req.query);
  return success(res, httpStatus.OK, messages.OK, result);
});

const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  return success(res, httpStatus.CREATED, messages.OK, appointment);
});

module.exports = {
  listAppointments,
  createAppointment,
};
