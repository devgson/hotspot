const Listing = require('../models/listing_model');
const fetch = require("node-fetch");

exports.getAddListing = async (req, res, next) => {
  try {
    res.render('add-listing');
  } catch (error) {
    res.send(error.message);
  }
}

exports.postAddListing = async (req, res, next) => {
  try {
    //req.body.owner = req.session.userID;
    const tags = req.body.tags.split(',');
    req.body.tags = tags;
    const listing = await new Listing(req.body).save();
    res.redirect('/admin/listings');
  } catch (error) {
    res.send(error.message);
  }
};

exports.DeleteListing = async (req, res, next) => {
  try {
    const listing = req.params.listing;
    await Listing.findOneAndRemove({
      slug: listing
    });
    res.redirect('/admin/listings');
  } catch (error) {
    res.send(error.message);
  }
};


exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.render('admin-listings', {
      listings
    });
  } catch (error) {
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
  } catch (error) {
    console.log(error);
  }
};