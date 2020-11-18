const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Config variables
require("dotenv").config();
const { MONGOURI } = process.env;

//Connecting to the database
mongoose.promise = global.Promise;
mongoose.connect(
  MONGOURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    if (err) console.log(err);
    else console.log("Database Connected");
  }
);
mongoose.set("useFindAndModify", false);

// Getting data in json format
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ type: "application/json" }));

// Setting express engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.use("/", require("./routes/index"));

// Starting the server
app.listen(process.env.PORT || 3004, () => {
  console.log(`Server started on port ${process.env.PORT || 3004}`);
});
