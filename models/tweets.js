const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: {
    type: String,
    required: true,
  },
  likeBy: [{ type: String }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Tweet = mongoose.model("tweets", tweetSchema);
module.exports = Tweet;
