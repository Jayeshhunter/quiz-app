const Member = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", hid: "" };

  //duplicate error code
  if (err.message === "incorrect id") {
    errors.hid = "that id is not registered";
  }

  if (err.code === 11000) {
    errors.email;
    return errors;
  }

  // Validation error
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, "secretkey", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.signAdminup_get = (req, res) => {
  res.render("signAdm");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, hid } = req.body;
  const ans = {
    title: "None",
    assigner: "None",
    deadline: "None",
    desc: "No task has been assigned",
  };
  const newAr = [];
  newAr.push(ans);
  try {
    const member = await Member.create({ email, hid, newAr });
    const token = createToken(member._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: member._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
module.exports.signAdminup_post = async (req, res) => {
  const { email, hid } = req.body;

  try {
    const admin = await Admin.create({ email, hid });
    const token = createToken(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: admin._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { hid } = req.body;

  try {
    const user = await Member.login(hid);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
module.exports.loginAdm_get = (req, res) => {
  res.render("loginAdm");
};
module.exports.loginAdm_post = async (req, res) => {
  const { hid } = req.body;

  try {
    const user = await Admin.login(hid);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
