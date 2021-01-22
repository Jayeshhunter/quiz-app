const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  hid: {
    type: String,
    required: [true, "Please enter an Id"],
  },
  arObj: [
    {
      _id: false,
      title: String,
      assigner: String,
      deadline: String,
      desc: String,
    },
  ],
});

// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
userSchema.pre("save", function (next) {
  console.log("User about to be created", this);
  next();
});

// static method to login user
userSchema.statics.login = async function (hid) {
  const user = await this.findOne({ hid });
  if (user) {
    return user;
  }
  throw Error("incorrect id");
};

const Member = mongoose.model("member", userSchema);
module.exports = Member;
