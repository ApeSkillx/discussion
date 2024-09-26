const mongoose = require('mongoose')
const Institute = new mongoose.Schema({
    name:String,
    member:[String],
    
})

module.exports = mongoose.model('Institute',Institute)
