const { postSchema } = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

module.exports.postId = (req, res, next) => {
  postSchema
    .findById(req.params.postId)
    .populate("postedBy")
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
    post.postedBy = req.user;
    if (files.photo) {
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
          const { title, body } = err.errors;
          switch (title.properties.type) {
            case "required":
              return res.status(400).json({ error: "Title require" });
            case "minlength":
              return res.status(400).json({ error: "Title min length is 5" });
            case "maxlength":
              return res.status(400).json({ error: "Title max length is 150" });
          }
          switch (body.properties.type) {
            case "required":
              return res.status(400).json({ error: "Body require" });
            case "minlength":
              return res.status(400).json({ error: "Body min length is 5" });
            case "maxlength":
              return res.status(400).json({ error: "Body max length is 2000" });
          }
        } catch (error) {
          return res.status(400).json({ error: "Fail create post" });
        }
      });
  });
};

module.exports.getPosts = (req, res) => {
  postSchema
    .find()
    .populate("postedBy", "_id name email")
    .select("_id title body postedBy")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json({ error: "Fail get post" }));
};

module.exports.postedByUser = (req, res) => {
  postSchema
    .find({ postedBy: req.user._id })
    .populate("postedBy", "_id name email")
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
  console.log(req.post);
  postSchema
    .findById(req.post._id)
    .then((data) => {
      const post = Object.assign(data, req.body);
      post.save().then((data) => res.json("updated"));
    })
    .catch((e) => res.status(400).json({ error: "Can not update post" }));
};
