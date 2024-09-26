const mongoose = require('mongoose');

//const DB =process.env.DATABASE;
const DB =process.env.ATLASDB;

console.log(DB);
mongoose.connect(DB)
    .then(() => {
        console.log('connected')
    }).catch((e) => {
        console.log(e)
    })

// const db = 'mongodb+srv://discussion:<userID>@cluster0.e7euu.mongodb.net/<DB name>t?retryWrites=true&w=majority';
// mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
// console.log('Db connceted suffuly')
// }).catch((err)=>{console.log('err',err.message)});