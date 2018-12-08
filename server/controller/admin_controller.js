const Listing = require('../models/listing_model');
const fetch = require("node-fetch");

exports.getAddListing = async (req, res, next) => {
  try {
    res.render('add-listing', {
      title: 'Add Listing',
      listing: {}
    });
  } catch (error) {
    res.send(error.message);
  }
}


exports.getEditListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      slug: req.params.listing
    })
    res.render('add-listing', {
      listing,
      title: 'Edit Listing'
    });
  } catch (error) {
    res.send("error is ", error.message);
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


exports.editListing = async (req, res, next) => {
  try {
    //req.body.owner = req.session.userID;
    const store = await Listing.findOneAndUpdate({
      slug: req.params.listing
    }, req.body, {
      new: true,
      runValidators: true
    }).exec();
    res.redirect('/admin/listings');
  } catch (error) {
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
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
      body.category = element.types[0];
      body.info = {
        address: element.formatted_address,
        country: 'Nigeria',
        state: 'Lagos',
        coordinates: {
          lat: element.geometry.location.lat,
          lon: element.geometry.location.lng
        }
      };
      const store = await new Listing(body).save();
    }
    res.send('limit reached');
  } catch (error) {
    console.log(error);
  }
};