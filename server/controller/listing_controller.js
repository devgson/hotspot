const Listing = require("../models/listing_model");
const User = require("../models/user_model");
const Review = require("../models/review_model");
const helper = require("../helper/helper");
const lodash = require("lodash");

exports.index = async (req, res) => {
  try {
    const listings = await Listing.find(
      {},
      {
        category: 1
      }
    );
    const getCategories = lodash.uniqBy(listings, "category");
    const categories = getCategories.map(cat => {
      return cat.category;
    });
    res.render("index", {
      listings,
      categories
    });
  } catch (error) {
    res.send(error.message);
  }
};
const paginate = require("express-paginate");

exports.getListing = async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(slug);
    const listing = await Listing.findOne({
      slug
    }).populate("reviews");
    console.log(listing);
    const reviewsInfo = await Review.aggregate([
      {
        $match: {
          listing: listing._id
        }
      },
      {
        $group: {
          _id: "$listing",
          numberOfReviews: {
            $sum: 1
          },
          total: {
            $sum: "$rating"
          }
        }
      }
    ]);
    const {
      numberOfReviewsPerRating,
      reviewsStat
    } = await helper.getReviewsStats(
      listing,
      reviewsInfo[0] ? reviewsInfo[0].numberOfReviews : 0
    );
    res.render("listing-detail", {
      reviewsInfo: reviewsInfo[0],
      listing,
      numberOfReviewsPerRating,
      reviewsStat
    });
  } catch (error) {
    res.send(error.message);
  }
};
exports.filterSearch = async (req, res) => {
  var rating_int;
  var query_selector = {};
  req.body.category
    ? (query_selector["category"] = { $in: req.body.category })
    : "";
  if (req.body.rating) {
    rating_int = req.body.rating.map(function(item) {
      return parseInt(item, 10);
    });
    query_selector["reviews.rating"] = { $in: rating_int };
  }
  var categories = await Listing.getCategoryList();
  var filter_details = [
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "listing",
        as: "reviews"
      }
    }
  ];
  var filter_count = [];
  if (Object.keys(query_selector).length > 0) {
    filter_details.push({ $match: query_selector });
    filter_count = [...filter_details];
    filter_count.push({ $count: "total" });
  }
  console.log("count ", filter_details);
  console.log("count ", filter_count);
  req.session.query_selector = query_selector;
  // var filter_listings = await Listing.aggregate();
  const [results, itemCount] = await Promise.all([
    Listing.aggregate(filter_details)
      .limit(req.query.limit)
      .skip(req.skip)
      .exec(),
    Listing.aggregate(filter_count)
  ]);
  const pageno = req.query.page || 1;
  const pageCount = Math.ceil(itemCount[0].total / req.query.limit);
  console.log("count is ", itemCount[0].total);
  res.render("category-view", {
    listings: results,
    pageCount,
    categories,
    itemCount: itemCount[0].total,
    results,
    pageno,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
};

exports.getFilters = async (req, res) => {
  var filter_details = [
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "listing",
        as: "reviews"
      }
    }
  ];

  var filter_count = [];
  if (Object.keys(req.session.query_selector).length > 0) {
    filter_details.push({ $match: req.session.query_selector });
    filter_count = [...filter_details];
    filter_count.push({ $count: "total" });
    console.log("count ", filter_details);
    console.log("count ", filter_count);
  }
  var categories = await Listing.getCategoryList();
  const [results, itemCount] = await Promise.all([
    Listing.aggregate(filter_details)
      .skip(req.skip)
      .limit(req.query.limit)
      .exec(),
    Listing.aggregate(filter_count)
  ]);

  console.log("results are ", req.session.query_selector);
  const pageno = req.query.page || 1;
  const pageCount = Math.ceil(itemCount[0].total / req.query.limit);
  console.log("count is ", itemCount[0].total);
  res.render("category-view", {
    listings: results,
    pageCount,
    categories,
    itemCount: itemCount[0].total,
    results,
    pageno,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
};
exports.findListings = async (req, res) => {
  try {
    console.log(req.body);
    req.session.category_search = req.body.category;
    req.session.title_search = req.body.title;
    req.session.address_search = req.body.location;

    var query = {
      category: {
        $regex: `.*` + req.body.category + `.*`,
        $options: "i"
      },
      title: {
        $regex: `.*` + req.body.title + `.*`,
        $options: "i"
      },
      "info.address": {
        $regex: `.*` + req.body.location + `.*`,
        $options: "i"
      }
    };

    var categories = await Listing.getCategoryList();
    console.log(query);

    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Listing.find({ ...query }).count()
    ]);

    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("category-view", {
      listings: results,
      pageCount,
      categories,
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
};

exports.getHomeListings = async (req, res) => {
  try {
    var query = {
      category: {
        $regex: `.*` + req.session.category_search + `.*`,
        $options: "i"
      },
      title: {
        $regex: `.*` + req.session.title_search + `.*`,
        $options: "i"
      },
      "info.address": {
        $regex: `.*` + req.session.address_search + `.*`,
        $options: "i"
      }
    };

    console.log(query);

    var categories = await Listing.getCategoryList();
    const [results, itemCount] = await Promise.all([
      Listing.find({ ...query })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Listing.find({ ...query }).count()
    ]);

    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("category-view", {
      listings: results,
      pageCount,
      itemCount,
      results,
      categories,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);
  }
};

exports.getfindListings = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Listing.find()
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Listing.countDocuments({})
    ]);
    const pageno = req.query.page || 1;

    var categories = await Listing.getCategoryList();
    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("category-view", {
      listings: results,
      pageCount,
      itemCount,
      categories,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

    // const listings = await Listing.find({...query})
    // res.render('category-view', { listings })
  } catch (e) {
    res.send(e.message);
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = res.locals.currentUser;
    // const user_bookmarks = user.bookmarks;
    var all_listings = [];
    if (user.bookmarks) {
      const user_bookmarks = user.bookmarks;
      for (var i = 0; i < user_bookmarks.length; i++) {
        const listing = await Listing.findOne({ _id: user_bookmarks[i] });
        all_listings.push(listing);
        //Do something
      }
    }
    console.log("all listings ", all_listings);
    res.render("bookmarks", { all_listings });
  } catch (e) {
    res.send(e.message);
  }
};
exports.getCategory = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Listing.find({
        category: req.params.category
      })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Listing.countDocuments({})
    ]);

    var categories = await Listing.getCategoryList();
    const pageno = req.query.page || 1;

    const pageCount = Math.ceil(itemCount / req.query.limit);
    res.render("category-view", {
      listings: results,
      pageCount,
      itemCount,
      categories,
      results,
      pageno,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (e) {
    res.send(e.message);
  }
};

exports.updateUserListing = async (req, res) => {
  var listing = await Listing.findOne({ slug: req.params.slug });
  console.log("slug is ", req.params.slug);
  res.render("update-listing", { listing });
};

exports.updateListing = async (req, res) => {
  var listing = await Listing.findOneAndUpdate({ slug: req.params.slug }, req.body);
  
  req.flash(
    "successVerify",
    "Your Listing has been Successfully updated"
  );
  res.redirect("/mylistings");
};

exports.autoSearch = async (req, res) => {
  const listings = await Listing.find({
    title: {
      $regex: `.*` + req.query.q + `.*`,
      $options: "i"
    }
  });
  res.json(listings);
};
