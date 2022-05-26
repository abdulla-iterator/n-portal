const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    // each comment can only relates to one article, so it's not in array
    article: {
      type: ObjectId,
      ref: 'Article',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Comment', commentSchema)
