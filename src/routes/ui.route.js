import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getData, getUserMeals } from "#controllers/ui/ui.controller.js" // ,getUserMealsChart, getUserHighestScore

const router = express.Router()

router.get("/data", getData) //Todo Add Verify User (Admin)
router.get("/userMeals", getUserMeals)
// router.get("/userMealsChart", getUserMealsChart);
// router.get("/userHighestScore", getUserHighestScore);

export default router
