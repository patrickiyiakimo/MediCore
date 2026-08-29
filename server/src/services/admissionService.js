const admissionRepository = require("../repositories/admissionRepository");

const listAdmissions = async ({ limit, offset }) =>
  admissionRepository.listAdmissions({ limit, offset });

module.exports = {
  listAdmissions,
};
