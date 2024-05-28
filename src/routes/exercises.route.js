import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getExerciseRecords, addExerciseRecord, getExerciseRecordDays } from "#controllers/exercise/exercise.controller.js"

const router = express.Router()

router.get('/exercises', verifyUser, getExerciseRecords)
router.post('/exercises', verifyUser, addExerciseRecord)
router.get('/getExerciseRecordDays', verifyUser, getExerciseRecordDays)

export default router