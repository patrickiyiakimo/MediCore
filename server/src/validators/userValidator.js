const Joi = require("joi");
const ROLES = require("../constants/roles");

const roleValues = Object.values(ROLES);

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...roleValues)
    .required(),
});

module.exports = {
  updateRoleSchema,
};
