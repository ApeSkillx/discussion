const mongoose = require('mongoose')
const ReplySchema = new mongoose.Schema({
  replied_to: [],
  body: String,
  auth: String, 
  replies: [{}],
  created_at: {
    type: Date,
  }
})

module.exports = mongoose.model('Replies', ReplySchema)