const { userSchema } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const expressjwt = require("express-jwt");
const formidable = require("formidable");
const fs = require("fs");

module.exports.signup = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Fileds error" });
    const { name, email, password } = fields;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Require name & email & password" });
    userSchema.findOne({ email }).then((user) => {
      if (user) return res.status(403).json({ error: "Email already exist" });
    });
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(fields.password, salt);

    const newUser = new userSchema(fields);

    if (files.photo) {
      if (files.photo.size > 1000000)
        return res.status(400).json({ error: "Photo should less than 1MB" });
      newUser.photo.data = fs.readFileSync(files.photo.path);
      newUser.photo.contentType = files.photo.type;
    }

    newUser.password = hash;
    newUser
      .save()
      .then((data) => {
        data.password = undefined;
        data.photo = undefined;
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(400).json({ error: "Can't signup, try again" });
      });
  });
};

module.exports.signin = (req, res) => {
  const user = req.body;
  if (!user.email || !user.password)
    return res.status(400).json({ error: "Require email & password" });
  userSchema
    .findOne({ email: user.email })
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .then((data) => {
      if (!bcrypt.compareSync(user.password, data.password))
        return res.status(401).json({ error: "Wrong password" });
      // phải lấy token để giải mã
      const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      // chuyển giao token để giải mã
      // res.cookie("t", token, {
      //   expires: new Date(Date.now() + 60 * 1000),
      // });
      data.password = undefined;
      return res.json({ token, user: data });
    })
    .catch((err) => res.status(401).json({ error: "Email doesn't exist" }));
};

module.exports.signout = (req, res) => {
  return res.clearCookie("t");
};

// Cách 1: Sử dụng module express-jwt làm middleware
module.exports.requireSignin = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
});
// Cách 2: sử dụng decode của jsonwebtoken
// module.exports.requireSignin = (req, res, next) => {
// const token = req.headers["auth-token"];
// if (!token)
//   return res.status(400).json({ error: "No token, Authorization denied" });
// try {
//   // Verify token
//   const decoded = jwt.verify(token, JWT_SECRET);
//   // Add user from payload
//   req.user = decoded;
//   next();
// } catch (e) {
//   return res
//     .status(404)
//     .json({ error: "Token is not valid, Login or Register!" });
// }
// };
