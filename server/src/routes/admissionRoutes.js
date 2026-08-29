const express = require("express");
const router = express.Router();

const admissionController = require("../controllers/admissionController");
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
  admissionController.listAdmissions
);

module.exports = router;
