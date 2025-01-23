import express from "express";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import {
  getProfileHandler,
  followUnFollowUser,
  getSuggestedUsers,
  updateUser,
} from "../controllers/user.controller.js";

router.get("/profile/:username", protectRoute, getProfileHandler);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUser);

export default router;
