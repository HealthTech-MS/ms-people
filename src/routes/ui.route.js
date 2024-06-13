import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getDashboardData, getAppData, getUserMealsChart, getUserAverageScore  } from "#controllers/ui/ui.controller.js"

const router = express.Router()

router.get("/data/dashboard", verifyUser, getDashboardData)
router.get("/data/app", verifyUser, getAppData)
router.get("/data/userMealsChart", verifyUser, getUserMealsChart);
router.get("/data/userAverageScore", verifyUser, getUserAverageScore);

export default router
