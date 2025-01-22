import express from 'express'
const router = express.Router()
import {signupHandler, loginHandler, logoutHandler} from "../controllers/auth.controller.js"

router.post("/signup", signupHandler)
router.post("/login", loginHandler)
router.post("/logout", logoutHandler)

export default router