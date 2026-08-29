const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const messages = require("../constants/messages");

const listUsers = async ({ limit = 20, offset = 0 }) => {
  return userRepository.listUsers({ limit, offset });
};

const updateUserRole = async (id, role) => {
  const updated = await userRepository.updateRole(id, role);
  if (!updated) throw ApiError.notFound(messages.USER_NOT_FOUND);
  return updated;
};

module.exports = { listUsers, updateUserRole };
