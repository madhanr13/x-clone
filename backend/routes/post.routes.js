import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  createCommentHandler,
  createPostHandler,
  deletePostHandler,
  getAllPostsHandler,
  getFollowingPostsHandler,
  getLikedPostsHandler,
  getUserPostHandler,
  likeUnlikePostHandler,
} from "../controllers/post.controller.js";
const router = express.Router();

router.get("/all", protectRoute, getAllPostsHandler);
router.get("/likes/:id", protectRoute, getLikedPostsHandler);
router.get("/following", protectRoute, getFollowingPostsHandler);
router.get("/user/:username", protectRoute, getUserPostHandler);
router.post("/create", protectRoute, createPostHandler);
router.post("/like/:id", protectRoute, likeUnlikePostHandler);
router.post("/comment/:id", protectRoute, createCommentHandler);
router.delete("/:id", protectRoute, deletePostHandler);

export default router;
