import express from "express"
import { verifyUser } from "#middleware/AuthValidation.js"
import { getData } from "#controllers/ui/ui.controller.js"

const router = express.Router()

router.get("/data", getData) //Todo Add Verify User (Admin)

export default router
