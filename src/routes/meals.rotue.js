import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getRecord, addRecord, getRecordDays } from "#controllers/meal/mealrecord.controller.js"

const router = express.Router()

router.get('/meals', verifyUser, getRecord)
router.post('/meals', verifyUser, addRecord)
router.get('/getRecordDays', verifyUser, getRecordDays)

export default router
