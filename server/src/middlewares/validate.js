const ApiError = require("../utils/ApiError");
const errorCodes = require("../constants/errorCodes");

/**
 * Generic Joi validation middleware factory.
 * Expected: validate(req.body, schema, options).
 */
const validate = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = {};
    for (const item of error.details) {
      details[item.path.join(".")] = item.message;
    }
    return next(
      new ApiError(
        400,
        "Validation failed",
        errorCodes.VALIDATION_ERROR,
        details
      )
    );
  }

  req[source] = value;
  return next();
};

module.exports = validate;
