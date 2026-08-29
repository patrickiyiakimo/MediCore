const staffRepository = require("../repositories/staffRepository");

const listStaff = async ({ role, limit, offset }) =>
  staffRepository.listStaff({ role, limit, offset });

module.exports = {
  listStaff,
};
