const Joi = require("joi");

// Define Joi schema for project validation
const customFieldSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid("input", "textarea", "multiselect").required(),
  value: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
});

const projectSchema = Joi.object({
  id: Joi.string().pattern(/^\S+$/).required().messages({
    "string.pattern.base": "ID cannot contain spaces",
  }),
  lastEdited: Joi.string().required(),
  // Name is required, other fields are optional
  name: Joi.string().required().messages({
    "string.empty": "Project name is required",
    "any.required": "Project name is required",
  }),
  logo: Joi.string().allow(""),
  description: Joi.string().required().messages({
    "string.empty": "Project description is required",
    "any.required": "Project description is required",
  }),
  longDescription: Joi.string().allow(""),
  skills: Joi.array().items(Joi.string()).default([]),
  website: Joi.string().allow(""),
  github: Joi.string().allow(""),
  images: Joi.array().items(Joi.string()).default([]),
  customFields: Joi.array().items(customFieldSchema).default([]),
  // Allow any additional fields
}).unknown(true);

module.exports = { projectSchema };
