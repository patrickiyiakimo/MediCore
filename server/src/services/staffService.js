const staffRepository = require("../repositories/staffRepository");

const listStaff = async ({ role, limit, offset }) =>
  staffRepository({ role, limit, offset });

module.exports = {
  listStaff,
};
