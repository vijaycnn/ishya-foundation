const Joi = require('joi') 
const schemas = { 

  documentCreate: Joi.object({
    title: Joi.string().required(),                       
    // filePath: Joi.string().required(),
  }),
  documentUpdate: Joi.object({
    documentId:  Joi.number().required(),
    title: Joi.string().required(),                       
    // filePath: Joi.string().required(),         
  }),
  documentGetById: Joi.object({
    documentId:  Joi.number().required() 
  }),
  documentDelete: Joi.object({
    documentId:  Joi.number().required(),                     
    status: Joi.number().required() 
  }),
}; 
module.exports = schemas;