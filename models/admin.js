const mongoose = require("mongoose");
const { isEmail } = require("validator");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Pleas enter an email"],
    unique: true,
    lowercase: true,
  },
  hid: {
    type: String,
    required: [true, "Pleas enter an Id"],
  },
});
// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
adminSchema.pre("save", function (next) {
  console.log("User about to be created", this);
  next();
});

// static method to login user
adminSchema.statics.login = async function (hid) {
  const user = await this.findOne({ hid });
  if (user) {
    return user;
  }
  throw Error("incorrect id");
};

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
