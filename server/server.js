const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const mongoStore = require('connect-mongo')(session);
const path = require('path');

const User = require('./models/user_model');
const app = express();

const db = 'mongodb://localhost:27017/hotspot';
mongoose.connect(db, {
  useNewUrlParser: true
});

app.set('json spaces', 3);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'))
app.use(express.static(path.join(__dirname + '/../public')));
app.use(session({
  secret: "testing",
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  })
}))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(flash());
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const currentUser = await User.findById(req.session.userId);
      currentUser ? res.locals.currentUser = currentUser : '';
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
})
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
})

const routes = require('./routes/routes');
app.use(routes);

app.use((req, res) => {
  res.render('404');
})

app.use((error, req, res) => {
  const errors = {
    errorStatus: error.status || 400,
    message: error
  };
  res.render('error', {
    errors
  })
})

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});