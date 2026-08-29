const Joi = require("joi");

const listQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

const createSchema = Joi.object({
  userId: Joi.string().uuid().allow(null).optional(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  dateOfBirth: Joi.date().iso().allow(null).optional(),
  gender: Joi.string().valid("male", "female", "other").allow(null).optional(),
  bloodGroup: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").allow(null).optional(),
  genotype: Joi.string().trim().max(10).allow(null).optional(),
  address: Joi.string().trim().max(255).allow(null).optional(),
  emergencyContactName: Joi.string().trim().max(100).allow(null).optional(),
  emergencyContactPhone: Joi.string().trim().max(30).allow(null).optional(),
});

module.exports = {
  listQuerySchema,
  createSchema,
};
