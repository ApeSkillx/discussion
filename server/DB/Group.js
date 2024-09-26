const mongoose = require('mongoose')
const GroupSchema = new mongoose.Schema({
    name:String,
    division:[String],
    
})

module.exports = mongoose.model('Group',GroupSchema)