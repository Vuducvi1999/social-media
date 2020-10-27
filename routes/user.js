const express = require("express");
const { requireSignin } = require("../controllers/auth");
const { userId } = require("../controllers/user");
const route = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getPhoto,
  postFollowing,
  postFollowers,
  postUnfollowing,
  postUnfollowers,
} = require("../controllers/user");

route.get("/user/users", getAllUsers);
route.put("/user/update/:userId", requireSignin, userId, updateUser);
route.post("/user/follow", requireSignin, postFollowing, postFollowers);
route.delete("/user/unfollow", requireSignin, postUnfollowing, postUnfollowers);

route.delete("/user/delete/:userId", requireSignin, userId, deleteUser);
route.get("/user/:userId", userId, (req, res) => res.json(req.user));
route.get("/user/photo/:userId", userId, getPhoto);

module.exports.userRoute = route;
