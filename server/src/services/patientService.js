const patientRepository = require("../repositories/patientRepository");
const ApiError = require("../utils/ApiError");
const messages = require("../constants/messages");

const listPatients = async ({ limit, offset }) =>
  patientRepository.listPatients({ limit, offset });

const getPatient = async (id) => {
  const patient = await patientRepository.findById(id);
  if (!patient) throw ApiError.notFound(messages.USER_NOT_FOUND);
  return patient;
};

const createPatient = async (payload) =>
  patientRepository.create(payload);

module.exports = {
  listPatients,
  getPatient,
  createPatient,
};
