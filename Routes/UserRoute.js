import express from "express"
import { verifyUser } from "../helpers/AuthValidation.js"
import { getUser } from "../Controllers/UserController.js"

const router = express.Router()

router.get('/user', verifyUser, getUser)

export default router
