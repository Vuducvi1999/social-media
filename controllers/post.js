const { postSchema } = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports.postId = (req, res, next) => {
  postSchema
    .findById(req.params.postId)
    .populate("postedBy", "_id name")
    .then((data) => {
      req.post = data;
      next();
    })
    .catch((e) => res.status(400).json({ error: "Can not get post" }));
};

module.exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fileds, files) => {
    if (err) return res.status(400).json({ error: "Image error" });
    const post = new postSchema(fileds);
    if (files.photo) {
      if (files.photo.size > 1000000)
        return res.status(400).json({ error: "Photo should less than 1MB" });
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post
      .save()
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        try {
          const { title, body, postedBy } = err.errors;
          if (title)
            switch (title.properties.type) {
              case "required":
                return res.status(400).json({ error: "Title require" });
              case "minlength":
                return res.status(400).json({ error: "Title min length is 5" });
              case "maxlength":
                return res
                  .status(400)
                  .json({ error: "Title max length is 150" });
            }
          if (body)
            switch (body.properties.type) {
              case "required":
                return res.status(400).json({ error: "Body require" });
              case "minlength":
                return res.status(400).json({ error: "Body min length is 5" });
              case "maxlength":
                return res
                  .status(400)
                  .json({ error: "Body max length is 2000" });
            }
          if (postedBy)
            return res.status(400).json({ error: "User Posted require" });
        } catch (error) {
          return res.status(400).json({ error: "Fail create post" });
        }
      });
  });
};

module.exports.getPosts = (req, res) => {
  postSchema
    .find()
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .populate("postedBy", "_id name ")
    .select("-photo")
    .sort({ createdAt: "desc" })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json({ error: "Fail get post" }));
};

module.exports.postedByUser = (req, res) => {
  postSchema
    .find({ postedBy: req.user._id })
    .populate("postedBy", "_id name email")
    .select("-photo -comments")
    .sort({ createdAt: "desc" })
    .then((data) => {
      return res.json(data);
    })
    .catch((e) => res.status(400).json({ error }));
};

module.exports.deletePost = (req, res) => {
  const post = req.post;
  console.log(post);
  post
    .remove()
    .then((data) => {
      return res.json("delete success");
    })
    .catch((e) => res.status(400).json({ error: "Can not delete post" }));
};

module.exports.updatePost = (req, res) => {
  postSchema
    .findById(req.params.postId)
    .then((data) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Image error" });
        if (!fields.title || !fields.body)
          return res.status(400).json({ error: "Title & Body require" });
        const post = Object.assign(data, fields);
        if (files.photo) {
          if (files.photo.size > 1000000)
            return res
              .status(400)
              .json({ error: "Photo should less than 1MB" });
          post.photo.data = fs.readFileSync(files.photo.path);
          post.photo.contentType = files.photo.type;
        }

        post
          .save()
          .then((data) => {
            return res.json(data);
          })
          .catch((err) => {
            try {
              const { title, body, postedBy } = err.errors;
              if (title)
                switch (title.properties.type) {
                  case "required":
                    return res.status(400).json({ error: "Title require" });
                  case "minlength":
                    return res
                      .status(400)
                      .json({ error: "Title min length is 5" });
                  case "maxlength":
                    return res
                      .status(400)
                      .json({ error: "Title max length is 150" });
                }
              if (body)
                switch (body.properties.type) {
                  case "required":
                    return res.status(400).json({ error: "Body require" });
                  case "minlength":
                    return res
                      .status(400)
                      .json({ error: "Body min length is 5" });
                  case "maxlength":
                    return res
                      .status(400)
                      .json({ error: "Body max length is 2000" });
                }
              if (postedBy)
                return res.status(400).json({ error: "User Posted require" });
            } catch (error) {
              return res.status(400).json({ error: "Fail create post" });
            }
          });
      });
    })
    .catch((e) => console.log(e));
};

module.exports.getPhotoPost = (req, res) => {
  const post = req.post;
  // res.json(post.photo);
  if (post.photo.contentType) return res.send(post.photo.data);
  return res.sendFile(path.join(__dirname + "/../public/default.jpg"));
};

module.exports.like = (req, res) => {
  postSchema
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.body.userId },
      },
      { new: true }
    )
    .select("-photo")
    .populate("postedBy", "_id name")
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Like error" }));
};

module.exports.unlike = (req, res) => {
  postSchema
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.body.userId },
      },
      { new: true }
    )
    .select("-photo")
    .populate("postedBy", "_id name")
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Unlike error" }));
};

module.exports.comment = (req, res) => {
  postSchema
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: { text: req.body.text, user: req.body.userId } },
      },
      { new: true }
    )
    .select("-photo")
    .populate("postedBy", "_id name")
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Comment error" }));
};

module.exports.uncomment = (req, res) => {
  postSchema
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { comments: { text: req.body.text, user: req.body.userId } },
      },
      { new: true }
    )
    .select("-photo")
    .populate("postedBy", "_id name")
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Uncomment error" }));
};

module.exports.find = (req, res) => {
  const str = req.body.find;
  postSchema
    .find({ title: { $regex: `${str}`, $options: "i" } })
    .populate({
      path: "comments",
      populate: { path: "user", select: "_id name" },
    })
    .populate("postedBy", "_id name ")
    .select("-photo")
    .sort({ createdAt: "desc" })
    .then((data) => res.json(data))
    .catch((e) => res.status(400).json({ error: "Find error" }));
};
