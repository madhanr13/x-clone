import express from "express";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import { getProfileHandler } from "../controllers/user.controller.js";

router.get("/profile/:username", protectRoute, getProfileHandler);

export default router;
