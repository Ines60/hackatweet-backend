const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Tweet = require("../models/tweets");

router.post("/newTweet", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    console.log("data is", data);
    const newTweet = new Tweet({
      user: data._id,
      message: req.body.message,
    });
    newTweet.save().then((data) => {
      res.json({ results: data });
    });
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

router.post("/incrementLike/:id", async (req, res) => {
  try {
    const { token } = req.body;

    // Vérifiez si les champs requis sont manquants
    if (!token) {
      return res.json({ result: false, error: "Champ token manquant" });
    }

    // Recherchez l'utilisateur par le token
    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non trouvé" });
    }

    // Recherchez le tweet par son ID
    const tweet = await Tweet.findOne({ _id: req.params.id });
    if (!tweet) {
      return res.json({ result: false, error: "Tweet non trouvé" });
    }

    // Vérifiez si l'utilisateur a déjà aimé le tweet
    const dejaAime = tweet.likeBy.includes(user.token);

    // Mettez à jour le tweet en fonction du fait qu'il soit aimé ou non
    const update = dejaAime
      ? { $pull: { likeBy: user.token } }
      : { $push: { likeBy: user.token } };

    const tweetMisAJour = await Tweet.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true }
    );

    // Retournez le tweet mis à jour
    res.json({ result: true, tweetMisAJour });
  } catch (err) {
    // Gérez les erreurs
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
