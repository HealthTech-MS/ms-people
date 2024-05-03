import createError from 'http-errors'
import MealRecord from '#data/models/meal/mealrecord.model.js'
import { mealRecordSchema } from '#validators/meal/mealRecordValidation.js'

export const getRecord = async (req, res, next) => {
  
}

export const addRecord = async (req, res, next) => {
  try {
    const result = await mealRecordSchema.validateAsync(req.query)

    const record = await MealRecord.create({ 
      name: result.name,
      type: result.type,
      score: result.type
    })
    
    if(!record){
      throw createError.NotFound('User not registered')
    }

    res.send({ "success": true })
  } catch (error) {
    if (error.isJoi === true) error.status = 406
    next(error)
  }
}