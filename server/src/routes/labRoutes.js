const express = require("express");
const router = express.Router();

const labController = require("../controllers/labController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const staffRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.DOCTOR,
  ROLES.LAB_TECHNICIAN,
];

router.get(
  "/",
  authenticate,
  requireRole(...staffRoles),
  labController.listLabRequests
);

module.exports = router;
