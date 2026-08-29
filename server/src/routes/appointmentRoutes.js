const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const appointmentValidator = require("../validators/appointmentValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const staffRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.DOCTOR,
  ROLES.NURSE,
  ROLES.RECEPTIONIST,
];

router.get(
  "/",
  authenticate,
  requireRole(...staffRoles),
  validate(appointmentValidator.listQuerySchema, "query"),
  appointmentController.listAppointments
);

router.post(
  "/",
  authenticate,
  requireRole(...staffRoles),
  validate(appointmentValidator.createSchema),
  appointmentController.createAppointment
);

module.exports = router;
