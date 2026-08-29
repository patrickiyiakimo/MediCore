const appointmentRepository = require("../repositories/appointmentRepository");

const listAppointments = async ({ limit, offset }) =>
  appointmentRepository.list({ limit, offset });

const createAppointment = async (payload) =>
  appointmentRepository.create(payload);

module.exports = {
  listAppointments,
  createAppointment,
};
