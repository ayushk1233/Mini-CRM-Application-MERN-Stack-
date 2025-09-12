const Joi = require('joi');

// Common validation schemas
const commonSchemas = {
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).message('Invalid phone number format'),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).allow('')
  })
};

// Validation middleware factory
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    req.query = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    req.params = value;
    next();
  };
};

module.exports = {
  commonSchemas,
  validateQuery,
  validateParams
};