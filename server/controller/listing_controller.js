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
const paginate = require('express-paginate');

exports.getListing = async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(slug);
    const listing = await Listing.findOne({
      slug
    }).populate('reviews');
    console.log(listing);
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

    req.session.category_search = req.body.category;
    req.session.title_search = req.body.title;
    req.session.address_search = req.body.location;
    console.log(req.body);
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

    console.log(query);


    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query
      }).limit(req.query.limit).skip(req.skip).lean().exec(),
      Listing.countDocuments({})
    ]);


    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render('category-view', {
      listings: results,
      pageCount,
      itemCount,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);

  }
}


exports.getfindListings = async (req, res) => {
  try {

    // req.session.category_search 
    // req.session.category_search 
    // req.session.category_search  
    console.log(req.session);
    var query = {
      category: {
        $regex: `.*` + req.session.category_search + `.*`,
        $options: 'i'
      },
      title: {
        $regex: `.*` + req.session.title_search + `.*`,
        $options: 'i'
      },
      'info.address': {
        $regex: `.*` + req.session.address_search + `.*`,
        $options: 'i'
      }
    }

    console.log(query);


    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query
      }).limit(req.query.limit).skip(req.skip).lean().exec(),
      Listing.countDocuments({})
    ]);


    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render('category-view', {
      listings: results,
      pageCount,
      itemCount,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);

  }
}


exports.getfindListings = async (req, res) => {
  try {

    // req.session.category_search 
    // req.session.category_search 
    // req.session.category_search  
    console.log(req.session);
    var query = {
      category: {
        $regex: `.*` + req.session.category_search + `.*`,
        $options: 'i'
      },
      title: {
        $regex: `.*` + req.session.title_search + `.*`,
        $options: 'i'
      },
      'info.address': {
        $regex: `.*` + req.session.address_search + `.*`,
        $options: 'i'
      }
    }

    console.log(query);


    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query
      }).limit(req.query.limit).skip(req.skip).lean().exec(),
      Listing.countDocuments({})
    ]);


    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render('category-view', {
      listings: results,
      pageCount,
      itemCount,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);

  }
}


exports.getBookmarks = async (req, res) => {
  try {
    
  const user = res.locals.currentUser;
  // const user_bookmarks = user.bookmarks;
  var all_listings = [];
  if(user.bookmarks){
    const user_bookmarks = user.bookmarks;
    for (var i = 0; i < user_bookmarks.length; i++) {
      const listing = await Listing.findOne({ _id: user_bookmarks[i] });
      all_listings.push(listing);
      //Do something
    }

  }
  console.log('all listings ', all_listings);
    res.render('bookmarks', {all_listings});
  }
  catch (e){
    console.log(e);
  }
}


exports.getfindListings = async (req, res) => {
  try {

    // req.session.category_search 
    // req.session.category_search 
    // req.session.category_search  
    console.log(req.session);
    var query = {
      category: {
        $regex: `.*` + req.session.category_search + `.*`,
        $options: 'i'
      },
      title: {
        $regex: `.*` + req.session.title_search + `.*`,
        $options: 'i'
      },
      'info.address': {
        $regex: `.*` + req.session.address_search + `.*`,
        $options: 'i'
      }
    }

    console.log(query);


    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query
      }).limit(req.query.limit).skip(req.skip).lean().exec(),
      Listing.countDocuments({})
    ]);


    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render('category-view', {
      listings: results,
      pageCount,
      itemCount,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);

  }
}
exports.getCategory = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Listing.find({
        category: req.params.category
      }).limit(req.query.limit).skip(req.skip).lean().exec(),
      Listing.countDocuments({})
    ]);

    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render('category-view', {
      listings: results,
      pageCount,
      itemCount,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (e) {
    res.send(e.message);

  }
}
