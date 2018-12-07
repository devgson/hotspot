const Store = require('../models/listing_model');
const fetch = require("node-fetch");


exports.postAddListing = async (req, res, next) => {
  try {
    req.body.owner = req.session.userID;
    const store = await new Store(req.body).save();
    console.log(req.body);
    res.redirect('admin-listings');
  } catch (error) {
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
    res.send(error.message);
  }
};


exports.addListingfromGoogle = async (req, res, next) => {
  try {
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Lagos&fields=rating,formatted_phone_number,address_component,opening_hours,formatted_phone_number,opening_hours,website,restaurant,opening_hours,night_club,shopping_mall,museum,supermarket,bowling_alley,bar&key=" + process.env.GOOGLE_KEY;
    const response = await fetch(url);
    const json = await response.json();
    req.listings = json;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.addListingtodb = async (req, res, next) => {
  try {
    let body = {};
    const listings = req.listings.results;
    console.log("length is", listings.length)
    for (var i = 0; i < listings.length; i++) {
      var element = listings[i];
      body.title = element.name;
      body.tags = element.types;
      const store = await new Store(body).save();
    }
    res.send('limit reached');
  }
  catch (error) {
    console.log(error);
  }
};

exports.getListing = async (req, res, next) => {
  try {
    const listings = await Store.find();
    res.render('admin-listings', { listings });
  } catch (error) {
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
    res.send(error.message);
  }
};