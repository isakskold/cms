const Joi = require("joi");

// Define Joi schema for project validation
const projectSchema = Joi.object({
  id: Joi.string().pattern(/^\S+$/).required().messages({
    "string.pattern.base": "ID cannot contain spaces",
  }),
  lastEdited: Joi.string().required(),
  name: Joi.string().required().messages({
    "string.empty": "Project name is required",
    "any.required": "Project name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Project description is required",
    "any.required": "Project description is required",
  }),
  // Allow any additional fields with their type information
}).unknown(true);

module.exports = { projectSchema };
