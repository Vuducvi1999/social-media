const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Title require",
      maxlength: 150,
      minlength: 5,
    },
    body: {
      type: String,
      required: "Body require",
      maxlength: 2000,
      minlength: 5,
    },
    photo: { data: Buffer, contentType: String },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports.postSchema = mongoose.model("post", postSchema);
