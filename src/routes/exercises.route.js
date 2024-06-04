import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getExerciseRecords, addExerciseRecord, getExerciseRecordDays } from "#controllers/exercise/exerciserecord.controller.js"

const router = express.Router()

router.get('/exercises', verifyUser, getExerciseRecords)
router.post('/exercises', verifyUser, addExerciseRecord)
router.get('/exercises/getRecordDays', verifyUser, getExerciseRecordDays)

export default router