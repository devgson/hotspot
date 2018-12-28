const Listing = require('../models/listing_model');
const User = require('../models/user_model');
const Review = require('../models/review_model');
const helper = require('../helper/helper');
const lodash = require('lodash')

exports.index = async (req, res) => {
  try {
    const listings = await Listing.find({}, {
      category: 1
    });
    const getCategories = lodash.uniqBy(listings, 'category');
    const categories = getCategories.map(cat => {
      return cat.category
    })
    res.render('index', {
      listings,
      categories
    })
  } catch (error) {
    res.send(error.message)
  }
}

exports.getListing = async (req, res) => {
  try {
    const slug = req.params.slug;
    const listing = await Listing.findOne({
      slug
    }).populate('reviews');
    const reviewsInfo = await Review.aggregate(
      [{
        $match: {
          listing: listing._id
        }
      }, {
        $group: {
          _id: "$listing",
          numberOfReviews: {
            $sum: 1
          },
          total: {
            $sum: "$rating"
          }
        }
      }, ])
    const {
      numberOfReviewsPerRating,
      reviewsStat
    } = await helper.getReviewsStats(listing, (reviewsInfo[0] ? reviewsInfo[0].numberOfReviews : 0));
    res.render('listing-detail', {
      reviewsInfo: reviewsInfo[0],
      listing,
      numberOfReviewsPerRating,
      reviewsStat
    });
  } catch (error) {
    res.send(error.message);
  }
}


exports.findListings = async (req, res) => {
  try {
    var query = {
      category: {
        $regex: `.*` + req.body.category + `.*`,
        $options: 'i'
      },
      title: {
        $regex: `.*` + req.body.title + `.*`,
        $options: 'i'
      },
      'info.address': {
        $regex: `.*` + req.body.location + `.*`,
        $options: 'i'
      }
    }
    //console.log('spread is', { ...query
    //});
    const listings = await Listing.find({ ...query
    }).populate('reviews')
    res.render('category-view', {
      listings
    })
  } catch (e) {
    res.send(e.message);

  }
}

exports.getCategory = async (req, res) => {
  try {
    const listings = await Listing.find({
      category: req.params.category
    })
    res.render('category-view', {
      listings
    })
  } catch (e) {
    res.send(e.message);

  }
}