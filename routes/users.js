const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");

router.post("/signup", async (req, res) => {
  try {
    const userName = await User.findOne({ userName: req.body.userName });
    if (userName) throw new Error("Username already exist");

    const newUser = await new User({
      firstName: req.body.firstName,
      userName: req.body.userName,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
    }).save();
    res.json({ result: true, newUser });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) throw new Error("User not found");
    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error("Password is incorrect");
    res.json({ result: true, user });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
