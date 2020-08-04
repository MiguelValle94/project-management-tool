const mongoose = require('mongoose')

require('./user.model')
require('./comment.model')

const projectSchema = new mongoose.Schema(
  { 
    document: {
        type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

tweetSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tweet",
  justOne: false,
});

tweetSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "tweet",
  justOne: false
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;