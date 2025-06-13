const Joi = require("joi");

// User validation schemas
const userSchemas = {
  signup: Joi.object({
    fullName: Joi.string().min(2).max(100).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
      "any.required": "Full name is required",
    }),
    email: Joi.string().email().max(255).required().messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email cannot exceed 255 characters",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "any.required": "Password is required",
    }),
  }),

  signin: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
};

// Generic validation middleware
const validateDTO = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    req.body = value;
    next();
  };
};

// Specific validation middlewares
const validateSignup = validateDTO(userSchemas.signup);
const validateSignin = validateDTO(userSchemas.signin);

module.exports = {
  validateDTO,
  validateSignup,
  validateSignin,
  userSchemas,
};
