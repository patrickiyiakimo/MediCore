const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const ROLES = require("../constants/roles");

const staffRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.HOSPITAL_ADMIN,
  ROLES.BILLING_STAFF,
];

router.get(
  "/",
  authenticate,
  requireRole(...staffRoles),
  invoiceController.listInvoices
);

module.exports = router;
