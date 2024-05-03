import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getUser } from "#controllers/user/user.controller.js"

const router = express.Router()

router.get('/user', verifyUser, getUser)

export default router
