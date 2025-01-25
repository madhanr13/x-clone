import express from "express";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import {
  deleteNotificationHandler,
  getNotificationsHandler,
} from "../controllers/notification.controller.js";

router.get("/", protectRoute, getNotificationsHandler);
router.delete("/", protectRoute, deleteNotificationHandler);

export default router;
