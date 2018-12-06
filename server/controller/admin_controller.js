const Listing = require('../models/listing_model');

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
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
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
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
    res.send(error.message);
  }
};