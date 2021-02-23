const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// to support JSON bodies

const path = require("path");
// middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/css/")));
app.use(express.static(path.join(__dirname, "public/js/")));

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.set("view engine", "ejs");

// view engine

// database connection node-auth
// const dbURI = "mongodb://localhost:27017/quizDB";
// console.log(dbURI);
const dbURI = process.env.SECRET_KEY;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));
4;
mongoose.set("useFindAndModify", false);
const Member = require("./models/user");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
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
      console.log(result);
      // console.log(result.arObj);

      res.render("data", {
        id: result.hid,
        forms: result.forms,
      });
    }
  });
});
app.get("/compose/:hid", cors(), checkUser, (req, res) => {
  const ur = req.params.hid;
  console.log(ur);
  res.render("template", {
    id: req.params.hid,
  });
});
app.post("/compose/:hid", checkUser, (req, res) => {
  const ur = req.params.hid;
  console.log(ur);
  const idea = Math.floor(Math.random() * 100000).toString();
  const url = "http://localhost:5000/formograph/" + idea;
  // const ob = {
  //   _id: idea,
  //   url: url,
  //   arObj: req.body,
  //   responses: [],
  // };
  const obj = req.body;
  const obj1 = {
    id: idea,
    url: url,
  };
  console.log(obj1);
  Member.findOneAndUpdate(
    { hid: req.params.hid },
    { $push: { forms: obj1 } },
    (err, result) => {
      // if (err) {
      //   console.log(err);
      // } else {
      if (err) {
        console.log(err);
      } else {
        console.log("check1 fo obj1");
        console.log(result);
      }
    }
  );
  Member.findOneAndUpdate(
    { "forms.id": idea },
    { "forms.$.arObj": obj },
    (err, result) => {
      // if (err) {
      //   console.log(err);
      // } else {
      if (err) {
        console.log(err);
      } else {
        console.log("check1 fo obj2");
        console.log(result);
      }
    }
  );
});
app.get("/response/:id", checkUser, (req, res) => {
  Member.findOne({ "forms.id": req.params.id }, (err, result) => {
    const apj = result.forms.find((x) => x.id === req.params.id);
    res.render("respond", {
      idVal: req.params.id,
      tab: apj.responses,
    });
  });
});
app.get("/formograph/:id", cors(), checkUser, (req, res) => {
  Member.findOne({ "forms.id": req.params.id }, (err, result) => {
    // res.render("forms",{
    //   questions:result.
    // })
    const opj = result.forms.find((x) => x.id === req.params.id);
    console.log(opj.arObj);
    res.render("formograph", {
      id: req.params.id,
      arObj: opj.arObj,
    });
  });
});
app.post("/formograph/:id", checkUser, (req, res) => {
  //console.log(req.body);
  const obje = req.body;
  delete obje.button;
  console.log(obje);
  // const ary = [];
  var valu = 0;
  var newAry = [];
  Member.findOne({ "forms.id": req.params.id }, (err, result) => {
    ary = result.forms.find((x) => x.id === req.params.id);
    //console.log(ary);
    ary.responses.push(obje);
    newAry = result.forms.filter(function (value, index, arr) {
      return value.id !== req.params.id;
    });
    valu = ary.responses.indexOf(obje);
    console.log("before inserting");
    console.log(newAry);
    newAry.push(ary);
    console.log("after");
    console.log(newAry);
    Member.findOneAndUpdate(
      { "forms.id": req.params.id },
      { forms: newAry },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("check1 fo formograph");
          console.log(result);
        }
      }
    );
  });
  // Member.findOneAndUpdate(
  //   { "forms.id": req.params.id },
  //   { $push: { "forms.$.responses": obje } },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("check1 fo formograph");
  //       console.log(result);
  //     }
  //   }
  // );
  //tatkal
  res.redirect("/evaluate/" + req.params.id + "/" + valu);
});
app.get("/evaluate/:id/:index", checkUser, (req, res) => {
  Member.findOne({ "forms.id": req.params.id }, (err, result) => {
    newVal = result.forms.find((x) => x.id === req.params.id);
    var counter = 0;
    var fullAr = [];
    newVal.responses.map((value, index) => {
      if (index === parseInt(req.params.index)) {
        for (const [key, ans] of Object.entries(value)) {
          op1 = newVal.arObj.find((x) => x.question === key);
          if (op1.answer === ans) {
            counter = counter + 1;
          }
          fullAr.push({
            question: op1.question,
            answ: op1.answer,
            yourAns: ans,
          });
        }
      }
    });
    console.log(fullAr);
    res.render("evaluate", {
      ard: fullAr,
      count: counter,
      len: fullAr.length,
    });
    //res.json(counter);
  });
});
// app.get("/dataAdm", cors(), checkAdmUser, (req, res) => {
//   Member.find({}, function (err, posts) {
//     res.render("dataAdm", { posts: posts });
//   });
// });
// app.get("/dataAdm/:id", cors(), checkAdmUser, (req, res) => {
//   const id = req.params.id;
//   Member.find({ hid: id }, function (err, result) {
//     console.log(result.arObj);
//     res.render("timeline", {
//       ans: result[0].arObj,
//     });
//   });
// });
// app.post("/data/:id", cors(), checkUser, (req, res) => {
//   const requestedPostId = req.params.id;
//   const title = req.body.title;
//   const assigned = req.body.assigned;
//   // const timingst = req.body.timingSt;
//   const timingen = req.body.timingEn;
//   const description = req.body.desc;
//   const ans = {
//     title: title,
//     assigner: assigned,
//     deadline: timingen,
//     desc: description,
//   };
//   console.log(ans);
//   Member.update(
//     { hid: requestedPostId },
//     {
//       $push: { arObj: ans },
//     },
//     function (err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(result);
//       }
//     }
//   );

//   console.log("Hello madhav");
//   // console.log("Check Here", doc);
//   console.log("mic checking");
//   res.redirect("/data/" + req.params.id);
// });
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
