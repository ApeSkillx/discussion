const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
require('./DB/conn');
const Users = require('./DB/module');
const app = express();

const PORT = process.env.PORT;

// Link the router file
app.use(express.json());
app.use(require('./Router/auth'));




app.listen(PORT, ()=>{
        console.log(`server running on port no. ${PORT}`)
})