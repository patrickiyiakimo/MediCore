const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediCore API",
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
