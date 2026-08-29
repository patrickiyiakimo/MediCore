const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staffController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const accessible = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.DEPARTMENT_HEAD,
  ROLES.DOCTOR,
  ROLES.NURSE,
];

router.get(
  "/",
  authenticate,
  requireRole(...accessible),
  staffController.listStaff
);

module.exports = router;
