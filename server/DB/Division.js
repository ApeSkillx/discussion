const mongoose = require('mongoose')
const Divsion = new mongoose.Schema({
    name:String,
    member:[String],
    
})

module.exports = mongoose.model('Division',Divsion)