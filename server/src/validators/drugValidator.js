const Joi = require("joi");

const listQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().trim().max(100).allow("").optional(),
});

const createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  genericName: Joi.string().trim().max(100).allow(null).optional(),
  category: Joi.string().trim().max(50).allow(null).optional(),
  unit: Joi.string().trim().max(20).allow(null).optional(),
  reorderLevel: Joi.number().integer().min(0).default(0),
});

module.exports = {
  listQuerySchema,
  createSchema,
};
