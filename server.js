const express = require('express');
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config();
require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoDBSession({ uri: process.env.DB_URI, collection: "sessions" }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});