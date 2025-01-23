import express from "express";
const router = express.Router();

import protectRoute from "../middlewares/protectRoute.js";
import {
  signupHandler,
  loginHandler,
  logoutHandler,
  getMeHandler,
} from "../controllers/auth.controller.js";

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.get("/me", protectRoute, getMeHandler);

export default router;
