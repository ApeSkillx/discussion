const mongoose = require('mongoose')
const SMD = new mongoose.Schema({
    name:String,
    division:[String],
    member:[String],    
    
})

module.exports = mongoose.model('Smd',SMD)