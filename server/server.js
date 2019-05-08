require("dotenv").config({
  path: "variables.env"
});
//var client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_ADMIN);
//var index = client.initIndex('listings');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const session = require("express-session");
var passport = require("passport");
const flash = require("connect-flash");
const mongoStore = require("connect-mongo")(session);
const fileUpload = require("express-fileupload");
const algoliasearch = require("algoliasearch");
const isProd = false;
const db = 
process.env.NODE_ENV === "production" || isProd
    ? process.env.PRODUCTION_DB
    : process.env.DEV_DB;
const path = require("path");
require("./auth/config")(passport);

const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_ADMIN);
const index = client.initIndex("listings");
index.setSettings({
  searchableAttributes: ["title", "tags", "category", "info"]
});

const paginate = require("express-paginate");
const User = require("./models/user_model");
const app = express();

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("Connected Successfully"))
  .catch(err => {
    throw new Error(err);
  });
// keep this before all routes that will use pagination

app.use(paginate.middleware(9, 50));
app.set("json spaces", 3);
app.set("view engine", "pug");
app.set("views", path.join(__dirname + "/views"));
app.use(fileUpload());
app.use(express.static(path.join(__dirname + "/../public")));
app.use(
  session({
    secret: "testing",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(flash());
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const currentUser = await User.findById(req.session.userId);
      currentUser ? (res.locals.currentUser = currentUser) : "";
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
app.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals.flashes = req.flash();
  next();
});

const routes = require("./routes/routes");
app.use(routes);

app.use((req, res) => {
  res.render("404");
});

app.use((error, req, res) => {
  const errors = {
    errorStatus: error.status || 400,
    message: error
  };
  res.render("error", {
    errors
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("path is", path.join(__dirname));
  console.log("Server listening at port 8080 ");
});
