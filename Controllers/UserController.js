import createError from 'http-errors'
import User from '../Models/User.js'
import { basicUserSchema } from '../helpers/validation_schema.js'

export const getUser = async (req, res, next) => {
  try {
    const result = await basicUserSchema.validateAsync(req.query)

    const user = await User.findOne({ 
      where:{
        phoneNumber: result.phoneNumber
      },
      attributes:["id", "uuid", "firstName", "lastName", "phoneNumber", "role", "createdAt"]
    })
    
    if(!user){
      throw createError.NotFound('User not registered')
    }

    res.send({ "success": true, user })
  } catch (error) {
    if (error.isJoi === true) error.status = 406
    next(error)
  }
}