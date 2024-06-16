import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getRecords, addRecord, getRecordDays} from "#controllers/meal/mealrecord.controller.js"

const router = express.Router()

router.get('/meals', verifyUser, getRecords)
router.post('/meals', verifyUser, addRecord)
router.get('/meals/getRecordDays', verifyUser, getRecordDays)

export default router
 