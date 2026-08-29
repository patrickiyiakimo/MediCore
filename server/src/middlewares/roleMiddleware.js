const ApiError = require("../utils/ApiError");
const messages = require("../constants/messages");

/**
 * Role-based authorization guard.
 * Usage: requireRole(ROLES.DOCTOR, ROLES.NURSE)
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized(messages.NOT_AUTHORIZED));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(ApiError.forbidden(messages.NOT_AUTHORIZED));
  }

  return next();
};

module.exports = requireRole;
