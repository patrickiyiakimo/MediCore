const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const patientRoutes = require("./patientRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const departmentRoutes = require("./departmentRoutes");
const staffRoutes = require("./staffRoutes");
const drugRoutes = require("./drugRoutes");
const prescriptionRoutes = require("./prescriptionRoutes");
const labRoutes = require("./labRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const admissionRoutes = require("./admissionRoutes");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediCore API",
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/departments", departmentRoutes);
router.use("/staff", staffRoutes);
router.use("/drugs", drugRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-requests", labRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/admissions", admissionRoutes);

module.exports = router;
