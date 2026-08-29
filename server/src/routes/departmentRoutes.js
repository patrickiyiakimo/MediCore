const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const accessible = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.DEPARTMENT_HEAD,
  ROLES.DOCTOR,
  ROLES.NURSE,
  ROLES.RECEPTIONIST,
];

router.get(
  "/",
  authenticate,
  requireRole(...accessible),
  departmentController.listDepartments
);

module.exports = router;
