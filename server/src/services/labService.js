const labRepository = require("../repositories/labRepository");

const listLabRequests = async ({ limit, offset, status }) =>
  labRepository.listLabRequests({ limit, offset, status: status || "" });

module.exports = {
  listLabRequests,
};
