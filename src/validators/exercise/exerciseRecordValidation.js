import Joi from '@hapi/joi'

export const exerciseRecordSchema = Joi.object({
  uuid: Joi.string().required(),
  name: Joi.string().min(2).required(),
  duration: Joi.number().required(),
  score: Joi.number().required()
});

export const getRecordSchema = Joi.object({
  uuid: Joi.string().min(36).max(36).required(),
  range: Joi.string().required()
});
