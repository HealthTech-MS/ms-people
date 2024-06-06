import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getDashboardData, getAppData } from "#controllers/ui/ui.controller.js"

const router = express.Router()

router.get("/data/dashboard", getDashboardData)
router.get("/data/app", verifyUser, getAppData)

export default router
