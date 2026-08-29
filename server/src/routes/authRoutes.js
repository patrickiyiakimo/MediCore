const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");
const validate = require("../middlewares/validate");

router.post("/register", validate(authValidator.registerSchema), authController.register);
router.post("/login", validate(authValidator.loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
