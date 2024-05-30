import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getExerciseRecords, addExerciseRecord, getExerciseRecordDays } from "#controllers/exercise/exerciserecord.controller.js"

const router = express.Router()

router.get('/exercises', getExerciseRecords)
router.post('/exercises', addExerciseRecord)
router.get('/exercises/getRecordDays', getExerciseRecordDays)

export default router