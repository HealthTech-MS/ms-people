import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getDashboardData, getAppData, getUserMealsChart, getUserAverageScore  } from "#controllers/ui/ui.controller.js"
import { getUserExercises, getUserExercisesChart } from '#controllers/ui/ui.controller.js';

const router = express.Router()

router.get("/data/dashboard", getDashboardData)
router.get("/data/app", verifyUser, getAppData)
router.get("/data/userMealsChart", getUserMealsChart);
router.get("/data/userAverageScore", getUserAverageScore);
router.get("/data/userExercises", getUserExercises);
router.get("/data/userExercisesChart", getUserExercisesChart);

export default router
