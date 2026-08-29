const userRepository = require("../repositories/userRepository");

/**
 * Business logic for user management.
 */
const listUsers = async ({ limit = 20, offset = 0 }) => {
  return userRepository.listUsers({ limit, offset });
};

module.exports = { listUsers };
