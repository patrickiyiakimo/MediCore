const Joi = require("joi");

const listQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

const createSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  doctorId: Joi.string().uuid().required(),
  departmentId: Joi.string().uuid().allow(null).optional(),
  reason: Joi.string().trim().max(255).allow(null).optional(),
  scheduledAt: Joi.date().iso().required(),
  status: Joi.string()
    .valid("scheduled", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show")
    .default("scheduled"),
  notes: Joi.string().trim().max(1000).allow(null).optional(),
});

module.exports = {
  listQuerySchema,
  createSchema,
};
