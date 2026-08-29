const Joi = require("joi");

const ROLES = [
  "super_admin",
  "hospital_admin",
  "department_head",
  "doctor",
  "nurse",
  "pharmacist",
  "lab_technician",
  "receptionist",
  "billing_staff",
];

/**
 * Joi schemas for authentication requests.
 */
const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().lowercase().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .required(),
  password: Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  role: Joi.string()
    .valid(...ROLES)
    .default("staff")
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
  remember_me: Joi.boolean().default(false),
});

module.exports = {
  registerSchema,
  loginSchema,
};
