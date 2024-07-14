const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: String,
  profilePictureURL: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
