const Listing = require('../models/listing_model');
const User = require('../models/user_model');

exports.getListing = async (req, res) => {
  try {
    const slug = req.params.slug;
    const listing = await Listing.findOne({
      slug
    });
    res.render('listing-detail', {
      listing
    });
  } catch (error) {
    res.send(error.message);
  }
}