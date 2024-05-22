import axios from "axios"
import createError from 'http-errors'
import dotenv from "dotenv"

dotenv.config()

export const verifyUser = async(req, res, next) => {
  if(!req.headers['authorization']){
    return next(createError.Unauthorized())
  }
    
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')[1].split("Bearer")[0]
  
  axios.get(`${process.env.MS_AUTH_URL}/verifyAccessToken`, {
    data:{ accessToken: bearerToken}
  })
  .then(() => {
    next()
  })
  .catch((error) => {
    if(error.response.status == 401){
      return next(createError.Unauthorized())
    }
  })
}