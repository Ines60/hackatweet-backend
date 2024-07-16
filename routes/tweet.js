const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Tweet = require("../models/tweets");

router.post("/newTweet", (req, res) => {
  const { token, message } = req.body;

  if (!token || !message) {
    return res.status(400).json({ error: "Token and message are required" });
  }

  User.findOne({ token })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const newTweet = new Tweet({
        user: user._id,
        message: req.body.message,
      });
      return newTweet.save();
    })
    .then((tweet) => {
      res.json({ results: tweet });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/", async (req, res) => {
  const result = await Tweet.find()
    .populate("user")
    .then((data) => {
      res.json({ result: true, tweet: data });
    });
});

router.delete("/deleteTweet/:id", async (req, res) => {
  try {
    const result = await Tweet.deleteOne({ _id: req.params.id });
    console.log(result);
    if (result.deleteCount === 0) {
      return res.json({ result: false, error: "Tweet not found" });
    }
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
