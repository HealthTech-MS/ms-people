import Joi from '@hapi/joi'

export const mealRecordSchema = Joi.object({
  name: Joi.string().min(2).required(),
  type: Joi.string().required(),
  score: Joi.number().required()
})

