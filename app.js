const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
// middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/css/")));
app.use(express.static(path.join(__dirname, "public/js/")));

app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

// view engine

// database connection node-auth
const dbURI = process.env.SECRET_KEY;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));
const Member = require("./models/user");
const {
  requireAuth,
  checkAdmUser,
  checkUser,
} = require("./middleware/authMiddleware");
// routes
// app.get("*", checkAdmUser);
// app.get("*", checkUser);
app.get("/", cors(), (req, res) => res.render("home"));
app.get("/data/:id", cors(), checkUser, (req, res) => {
  const requestedPostId = req.params.id;
  console.log("Do you copy");
  console.log(requestedPostId);
  Member.findOne({ hid: requestedPostId }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Hello");
      console.log(result.arObj);

      res.render("data", {
        id: result.hid,
        array: result.arObj,
      });
    }
  });
});
app.get("/dataAdm", cors(), checkAdmUser, (req, res) => {
  Member.find({}, function (err, posts) {
    res.render("dataAdm", { posts: posts });
  });
});
app.get("/dataAdm/:id", cors(), checkAdmUser, (req, res) => {
  const id = req.params.id;
  Member.find({ hid: id }, function (err, result) {
    console.log(result.arObj);
    res.render("timeline", {
      ans: result[0].arObj,
    });
  });
});
app.post("/data/:id", cors(), checkUser, (req, res) => {
  const requestedPostId = req.params.id;
  const title = req.body.title;
  const assigned = req.body.assigned;
  // const timingst = req.body.timingSt;
  const timingen = req.body.timingEn;
  const description = req.body.desc;
  const ans = {
    title: title,
    assigner: assigned,
    deadline: timingen,
    desc: description,
  };
  console.log(ans);
  Member.update(
    { hid: requestedPostId },
    {
      $push: { arObj: ans },
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );

  console.log("Hello madhav");
  // console.log("Check Here", doc);
  console.log("mic checking");
  res.redirect("/data/" + req.params.id);
});
// app.get("/set-cookies", (req, res) => {
//   res.cookie("newUser", false);
//   res.cookie("isMember", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
//   res.send("you got the cookies");
// });
// {$push:{arObj:ans}}
// app.get("/read-cookies", (req, res) => {
//   const cookie = req.cookies;
//   console.log(cookie.newUser);
//   res.json(cookie);
// });
app.use(authRoutes);
