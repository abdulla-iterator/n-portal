const mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 31,
    trim: true,
  },
})
module.exports = mongoose.model('Category', categorySchema)
