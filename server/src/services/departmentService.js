const departmentRepository = require("../repositories/departmentRepository");

const listDepartments = async () => departmentRepository.listDepartments();

module.exports = {
  listDepartments,
};
