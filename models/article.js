const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

var articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 122,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    slug: {
      type: String,
      unique: true,
    },

    comments: [
      {
        type: ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
)
module.exports = mongoose.model('Article', articleSchema)
