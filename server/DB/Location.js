const mongoose = require('mongoose')
const Location = new mongoose.Schema({
    name:String,
    designation:[
        {
            id:String,
            name:String
        }
    ],    
})

module.exports = mongoose.model('Location',Location)