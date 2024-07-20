const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Tweet = require("../models/tweets");

router.post("/newTweet", async (req, res) => {
  try {
    if (!req.body.token || !req.body.message) {
      return res.status(400).json({ error: "Token and message are required" });
    }
    const user = await User.findOne({ token: req.body.token });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newTweet = new Tweet({
      user: user._id,
      message: req.body.message,
    });

    const savedTweet = await newTweet.save();

    res.json({ results: savedTweet });
  } catch (error) {
    console.error("Error while creating new tweet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
    const user = await User.findOne({ token: req.body.token });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    console.log("User is ", user._id);

    const tweet = await Tweet.findOne({ _id: req.params.id });
    if (!tweet) {
      return res.json({ result: false, error: "Tweet not found" });
    }

    if (user._id.toString() !== tweet.user._id.toString()) {
      return res.json({ result: false, error: "Unauthorized" });
    }

    const deleteResult = await Tweet.deleteOne({ _id: req.params.id });
    if (deleteResult.deletedCount === 0) {
      return res.json({ result: false, error: "Tweet not found" });
    }

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.post("/incrementLike/:id", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ result: false, error: "Champ token manquant" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non trouvé" });
    }

    const tweet = await Tweet.findOne({ _id: req.params.id });
    if (!tweet) {
      return res.json({ result: false, error: "Tweet non trouvé" });
    }

    const dejaAime = tweet.likeBy.includes(user.token);

    const update = dejaAime
      ? { $pull: { likeBy: user.token } }
      : { $push: { likeBy: user.token } };

    const tweetMisAJour = await Tweet.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true }
    );

    res.json({ result: true, tweetMisAJour });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
