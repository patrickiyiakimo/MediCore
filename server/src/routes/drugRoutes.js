const express = require("express");
const router = express.Router();

const drugController = require("../controllers/drugController");
const drugValidator = require("../validators/drugValidator");
const validate = require("../middlewares/validate");
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
  validate(drugValidator.listQuerySchema, "query"),
  drugController.listDrugs
);

router.post(
  "/",
  authenticate,
  requireRole(...staffRoles),
  validate(drugValidator.createSchema),
  drugController.createDrug
);

module.exports = router;
