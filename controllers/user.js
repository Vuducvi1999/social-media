const { userSchema } = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports.userId = (req, res, next) => {
  const id = req.params.userId;
  userSchema
    .findById(id)
    .select("-password -photo")
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Not found user" });
      data.photo = undefined;
      req.user = data;
      next();
    })
    .catch((e) => res.status(400).json({ error: "Not found user" }));
};

module.exports.getAllUsers = (req, res) => {
  userSchema
    .find()
    .select("-password -photo")
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .then((data) => {
      return res.json(data);
    })
    .catch((e) => res.status(400).json({ error: "Not found" }));
};

module.exports.updateUser = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Field error" });
    if (!fields.email || !fields.password)
      return res.status(400).json({ error: "Require email & password" });
    userSchema
      .findOne({ email: fields.email })
      .then((data) => {
        if (!bcrypt.compareSync(fields.password, data.password))
          return res.status(401).json({ error: "Wrong password" });
        if (fields.password) {
          // hash password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(fields.password, salt);
          fields.password = hash;
        }
        const user = Object.assign(req.user, fields);
        if (files.photo) {
          user.photo.data = fs.readFileSync(files.photo.path);
          user.photo.contentType = files.photo.type;
        }
        user
          .save()
          .then((data) => {
            const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
              expiresIn: "1d",
            });
            data.password = undefined;
            data.photo = undefined;
            return res.json({ token, user: data });
          })
          .catch((e) => res.status(400).json({ error: "Can not update user" }));
      })
      .catch((err) => res.status(401).json({ error: "Email doesn't exist" }));
  });
};

module.exports.deleteUser = (req, res) => {
  req.user
    .remove()
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Can not delete user" }));
};

module.exports.getPhoto = (req, res) => {
  userSchema
    .findById(req.user._id)
    .then((data) => {
      if (!data.photo.data) {
        res.sendFile(path.join(__dirname + "/../public/anonymous.jpg"));
      } else {
        return res.send(data.photo.data);
      }
    })
    .catch((e) => res.status(400).json({ error: "Image error" }));
};

module.exports.postFollowing = (req, res, next) => {
  const { userId, followId } = req.body;
  userSchema
    .findByIdAndUpdate(
      userId,
      { $push: { following: followId } },
      { new: true, useFindAndModify: false }
    )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .then((data) => {
      console.log(data);
      next();
    })
    .catch((e) => res.status(400).json({ error: "Follow error 1" }));
};
module.exports.postFollowers = (req, res) => {
  const { userId, followId } = req.body;
  userSchema
    .findByIdAndUpdate(
      followId,
      { $push: { followers: userId } },
      { new: true, useFindAndModify: false }
    )
    .populate("followers", "_id name")
    .populate("following", "_id name")
    .select("-photo")
    .then((data) => {
      return res.json({ followers: data });
    })
    .catch((e) => res.status(400).json({ error: "Follow error 2" }));
};

module.exports.postUnfollowing = (req, res, next) => {
  const { userId, unfollowId } = req.body;
  console.log(req.body);
  userSchema
    .findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowId } },
      { new: true, useFindAndModify: false }
    )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .then((data) => {
      next();
    })
    .catch((e) => res.status(400).json({ error: "Follow error 1" }));
};
module.exports.postUnfollowers = (req, res) => {
  const { userId, unfollowId } = req.body;
  userSchema
    .findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      { new: true, useFindAndModify: false }
    )
    .populate("followers", "_id name")
    .populate("following", "_id name")
    .select("-photo")
    .then((data) => {
      return res.json({ followers: data });
    })
    .catch((e) => res.status(400).json({ error: "Follow error 2" }));
};
