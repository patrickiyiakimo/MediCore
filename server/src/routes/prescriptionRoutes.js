const express = require("express");
const router = express.Router();

const prescriptionController = require("../controllers/prescriptionController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const staffRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.PHARMACIST,
  ROLES.DOCTOR,
];

router.get(
  "/",
  authenticate,
  requireRole(...staffRoles),
  prescriptionController.listPrescriptions
);

module.exports = router;
