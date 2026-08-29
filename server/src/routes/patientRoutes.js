const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const patientValidator = require("../validators/patientValidator");
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
  validate(patientValidator.listQuerySchema, "query"),
  patientController.listPatients
);

router.get(
  "/:id",
  authenticate,
  requireRole(...staffRoles),
  patientController.getPatient
);

router.post(
  "/",
  authenticate,
  requireRole(...staffRoles),
  validate(patientValidator.createSchema),
  patientController.createPatient
);

module.exports = router;
