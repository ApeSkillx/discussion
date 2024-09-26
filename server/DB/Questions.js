const mongoose = require('mongoose')
const QuestionSchema = new mongoose.Schema({
    title:String,
    body:String,
    auth:String,
    smdid:[],       
    subject:String, 
    member:[String],
    institute:[String],
    Imember:[String],
    items:[],
    created_at:{
        type:Date,
        //default:Date.now()
    },
    updated_at:{
        type:Date,
        //default:Date.now()
    },
    file:String,
    group:String
    
})

module.exports = mongoose.model('Questions',QuestionSchema)