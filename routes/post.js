const express = require("express");
const { requireSignin } = require("../controllers/auth");
const {
  createPost,
  getPosts,
  postedByUser,
  postId,
  deletePost,
  updatePost,
  getPhotoPost,
} = require("../controllers/post");
const { userId } = require("../controllers/user");
const route = express.Router();

route.post("/post/create", requireSignin, createPost);
route.delete("/post/delete/:postId", requireSignin, postId, deletePost);
route.put("/post/update/:postId", requireSignin, updatePost);
route.get("/post/posts", getPosts);
route.get("/post/photo/:postId", postId, getPhotoPost);
route.get("/post/:postId", postId, (req, res) => res.json(req.post));
route.get("/post/by/:userId", userId, postedByUser);

module.exports.postRoute = route;
