const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');


// MongoDB url
const url = config.get('mongoURI');

//Connecting to the database
mongoose.promise = global.Promise;
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, (err,db)=> {
    if(err)
    console.log(err);

    else
    console.log('Database Connected');
});


//view engine
app.set('view engine','ejs');
app.set('views','./Views');


// routes
//app.use(require('./routes/index.js'));

// Starting the server
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started on port 3000"); 
});