const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const route = express.Router();

route.post("/user/signup", signup);
route.post("/user/signin", signin);
route.get("/user/signout", signout);

module.exports.authRoute = route;
