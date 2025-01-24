import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  createCommentHandler,
  createPostHandler,
  deletePostHandler,
  likeUnlikePostHandler,
} from "../controllers/post.controller.js";
const router = express.Router();

router.get("/all", protectRoute, )
router.post("/create", protectRoute, createPostHandler);
router.post("/like/:id", protectRoute, likeUnlikePostHandler);
router.post("/comment/:id", protectRoute, createCommentHandler);
router.delete("/:id", protectRoute, deletePostHandler);

export default router;
