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
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (error, db) => {
    if (error) console.log(error);
    else console.log("Database Connected...");
  }
);

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
