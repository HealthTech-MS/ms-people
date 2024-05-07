import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getRecord, addRecord, getRecordDays } from "#controllers/meal/mealrecord.controller.js"

const router = express.Router()

router.get('/meals', await verifyUser, getRecord)
router.post('/meals', await verifyUser, addRecord)
router.get('/getRecordDays', getRecordDays)

export default router
