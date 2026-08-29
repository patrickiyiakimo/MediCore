const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

router.get(
  "/",
  authenticate,
  requireRole(
    ROLES.SUPER_ADMIN,
    ROLES.HOSPITAL_ADMIN,
    ROLES.DEPARTMENT_HEAD
  ),
  userController.listUsers
);

module.exports = router;
