const Joi = require("joi");

// Define Joi schema for project validation
const projectSchema = Joi.object({
  id: Joi.string().pattern(/^\S+$/).required().messages({
    "string.pattern.base": "ID cannot contain spaces",
  }),
  lastEdited: Joi.string().required(),
  name: Joi.string().required(),
  logo: Joi.string().required(),
  description: Joi.string().required(),
  longDescription: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).required(),
  website: Joi.string().required(),
  github: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
});

module.exports = { projectSchema };
