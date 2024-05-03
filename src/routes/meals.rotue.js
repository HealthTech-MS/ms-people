import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { addRecord } from "#controllers/meal/mealrecord.controller.js"

const router = express.Router()

router.post('/records', verifyUser, addRecord)

export default router
