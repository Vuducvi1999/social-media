const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { PORT, MONGO_URI } = require("./config");

// require route
const { postRoute } = require("./routes/post");
const { authRoute } = require("./routes/auth");
const { userRoute } = require("./routes/user");

mongoose
  .connect(MONGO_URI, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => console.log("Connect DB success!"))
  .catch((err) => console.log(`connect DB fail`));

// use middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// use route
app.use("/api", postRoute);
app.use("/api", authRoute);
app.use("/api", userRoute);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Require token" });
  } else return res.status(401).json({ error: "Expired token, login again" });
});

const port = PORT || 8000;

app.listen(port, () => {
  console.log(`Server start port ${port}`);
});
