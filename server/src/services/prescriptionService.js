const prescriptionRepository = require("../repositories/prescriptionRepository");

const listPrescriptions = async ({ limit, offset }) =>
  prescriptionRepository.listPrescriptions({ limit, offset });

module.exports = {
  listPrescriptions,
};
