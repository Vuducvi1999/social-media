const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    photo: { data: Buffer, contentType: String },
    about: String,
    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    posts: [{ type: mongoose.Types.ObjectId, ref: "post" }],
  },
  { timestamps: true }
);

module.exports.userSchema = mongoose.model("user", userSchema);
