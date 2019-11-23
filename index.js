const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const bodyParser = require('body-parser');

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
mongoose.set('useFindAndModify', false);


// Getting data in json format
app.use(bodyParser.urlencoded({extended:true}));

// Setting express engine
app.set('view engine', 'ejs');
app.use(express.static("public"));

// routes
app.use('/', require('./routes/index'));

// Starting the server
app.listen(process.env.PORT || 3001, ()=>{
    console.log(`Server started on port ${process.env.PORT || 3001}`); 
});
