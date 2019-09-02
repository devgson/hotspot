const Listing = require("../models/listing_model");
const User = require("../models/user_model");
const Admin = require("../models/admin_model");
const Verify = require("../models/verify_user_model");
const fetch = require("node-fetch");
const helper = require("../helper/helper");
// const algoliasearch = require("algoliasearch");
const { google } = require("googleapis");

// var client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_ADMIN);
// var index = client.initIndex("listings");
const { cloudinary, flat } = require("../helper/helper");

const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const jwt = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes
);
const view_id = "186345526";

function getDaysAgo() {
  const startDate = new Date("10/10/2018");
  const endDate = new Date();
  const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
  const daysAgo = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysAgo;
}

// Number of pageviews in the last 30 days
async function numberOfPageviewsInLast30Days() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": "30daysAgo",
    "end-date": "today",
    metrics: "ga:pageviews"
  });
  return {
    name: "Pageviews in the last 30 days",
    header: "Pageviews",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Number of pageviews
async function numberOfPageviews() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    metrics: "ga:pageviews"
  });
  return {
    name: "Total Pageviews",
    header: "Pageviews",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Number of unique pageviews in the last 30 days
async function numberOfUniquePageviewsInLast30Days() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": "30daysAgo",
    "end-date": "today",
    metrics: "ga:uniquePageviews"
  });
  return {
    name: "Unique Pageviews in the last 30 days",
    header: "Unique Pageviews",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Number of unique pageviews
async function numberOfUniquePageviews() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    metrics: "ga:uniquePageviews"
  });
  return {
    name: "Number of Unique Pageviews",
    header: "Unique Pageviews",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Top browsers users visit from
async function topBrowsers() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    dimensions: "ga:browser",
    metrics: "ga:sessions"
  });
  if (!result.data.rows || result.data.rows.length <= 0) return [];
  const sortedBrowsers = result.data.rows.sort((a, b) => b[1] - a[1]);
  const sortedBrowsersInObject = sortedBrowsers.map(browser => {
    return {
      [browser[0]]: browser[1]
    };
  });
  return {
    name: "Top Browsers users visit the site from",
    header: "Browsers",
    browsers: sortedBrowsers
  };
}

// Top 5 listings viewed
async function topListings() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    metrics: "ga:pageviews",
    dimensions: "ga:pagePath"
  });
  if (!result.data.rows || result.data.rows.length <= 0) return [];
  const sortedListings = result.data.rows.sort((a, b) => b[1] - a[1]);
  /*const sortedListingsInObject = sortedListings.map(listing => {
    /*const slashIndex = listing[0].lastIndexOf("/");
    const getPathName =
      slashIndex > 0 ? listing[0].slice(slashIndex + 1) : listing[0];*/
  /*return {
      [listing[0]]: listing[1]
    };
  });*/
  return {
    name: "Top Listings users visit",
    header: "Listings",
    listings: sortedListings
  };
}

// NUmber of todays session
async function numberOfTodaysSession() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `today`,
    "end-date": "today",
    metrics: "ga:sessions"
  });
  return {
    name: "Number of Sessions Today",
    header: "Sessions",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

async function numberOfYesterdaysSession() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `yesterday`,
    "end-date": "yesterday",
    metrics: "ga:sessions"
  });
  return {
    name: "Number of Sessions Yesterday",
    header: "Sessions",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Total number of sessions
async function totalSessions() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    metrics: "ga:sessions"
  });
  return {
    name: "Total User Sessions",
    header: "Sessions",
    views: result.data.rows ? result.data.rows[0][0] : "0"
  };
}

// Number of pageviews by traffic source
async function pageViewsTrafficSource() {
  const response = await jwt.authorize();
  const result = await google.analytics("v3").data.ga.get({
    auth: jwt,
    ids: "ga:" + view_id,
    "start-date": `${getDaysAgo()}daysAgo`,
    "end-date": "today",
    metrics: "ga:pageviews",
    dimensions: "ga:source"
  });
  if (!result.data.rows || result.data.rows.length <= 0) return [];
  const sortedSources = result.data.rows.sort((a, b) => b[1] - a[1]);
  /*const sortedSourcesInObject = sortedSources.map(source => {
    return {
      [source[0]]: source[1]
    };
  });*/
  return {
    name: "Where users visit from",
    header: "Traffic Sources",
    sources: sortedSources
  };
}

function upload(image) {
  return new Promise((resolve, reject) => {
    cloudinary()
      .uploader.upload_stream(result => resolve(result))
      .end(image.data);
  });
}

function deleteUpload(image) {
  return new Promise((resolve, reject) => {
    cloudinary().v2.uploader.destroy(image, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

exports.dashboard = async (req, res, next) => {
  try {
    const [
      pageviewsInLast30Days,
      pageviews,
      uniquePageviewsInLast30Days,
      uniquePageviews,
      browsers,
      listings,
      todaysSessions,
      yesterdaysSessions,
      sessions,
      trafficSource
    ] = await Promise.all([
      numberOfPageviewsInLast30Days(),
      numberOfPageviews(),
      numberOfUniquePageviewsInLast30Days(),
      numberOfUniquePageviews(),
      topBrowsers(),
      topListings(),
      numberOfTodaysSession(),
      numberOfYesterdaysSession(),
      totalSessions(),
      pageViewsTrafficSource()
    ]);
    res.render("dashboard", {
      bigGuys: {
        browsers,
        listings,
        trafficSource
      },
      data: {
        pageviewsInLast30Days,
        pageviews,
        uniquePageviewsInLast30Days,
        uniquePageviews,
        todaysSessions,
        yesterdaysSessions,
        sessions
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminId) {
    res.redirect("/admin");
  } else {
    next();
  }
};

exports.isAdminLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminId) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAddListing = async (req, res, next) => {
  try {
    res.render("add-listing", {
      title: "Add Listing",
      listing: {}
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.getEditListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      slug: req.params.listing
    });
    res.render("edit-listing", {
      listing,
      title: "Edit Listing"
    });
  } catch (error) {
    res.send("error is ", error.message);
  }
};

async function getCoordinates(address, state, country = "Nigeria") {
  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address},${state}&key=` +
      process.env.GOOGLE_KEY;
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === "ZERO_RESULTS")
      return "The address passed along does not exist, please pass a valid address";
    if (json.status !== "OK")
      return `An error : ${json.status} occured while trying to parse the listing address`;
    const coordinates = json.results[0].geometry.location;
    return {
      lat: coordinates.lat,
      lon: coordinates.lng,
      formatedAddress: json.results[0].formatted_address
    };
  } catch (error) {
    throw new Error(error);
  }
}

exports.postAddListing = async (req, res, next) => {
  try {
    //req.body.owner = req.session.userID;
    const coordinates = await getCoordinates(
      req.body.info.address,
      req.body.info.state
    );
    if (typeof coordinates !== "object") throw new Error(error);
    req.body.info.coordinates.lat = coordinates.lat;
    req.body.info.coordinates.lon = coordinates.lon;
    req.body.info.address = coordinates.formatedAddress;
    req.body.tags = req.body.tags.split(",");
    await new Listing(req.body).save();
    res.redirect("/admin/listings");
  } catch (error) {
    res.send(error.message);
  }
};

exports.editListing = async (req, res, next) => {
  try {
    const updatedListing = req.body;
    updatedListing.tags
      ? (updatedListing.tags = updatedListing.tags.split(","))
      : [];
    const coordinates = await getCoordinates(
      updatedListing.info.address,
      updatedListing.info.state
    );
    if (typeof coordinates !== "object") throw new Error(error);
    updatedListing.info.coordinates = {};
    updatedListing.info.coordinates.lat = coordinates.lat;
    updatedListing.info.coordinates.lon = coordinates.lon;
    updatedListing.info.address = coordinates.formatedAddress;
    const listing = await Listing.findOneAndUpdate(
      {
        slug: req.params.listing
      },
      updatedListing,
      {
        new: true,
        runValidators: true
      }
    );
    res.render("edit-listing", {
      listing
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.DeleteListing = async (req, res, next) => {
  try {
    const listing = req.params.listing;
    await Listing.findOneAndDelete({
      slug: listing
    });
    res.redirect("/admin/listings");
  } catch (error) {
    res.send(error.message);
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.render("admin-listings", {
      listings
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.doSettimeout = nextpageurl => {
  // let temp_next_data = null;
  // setTimeout(async () => {
  //   temp_next_data = await helper.getRequest(nextpageurl);
  //   console.log(nextpageurl);
  // }, 5000);
  // console.log("next ", temp_next_data);
  // return temp_next_data;

  var promise = new Promise(function(resolve, reject) {
    setTimeout(async function() {
      temp_next_data = await helper.getRequest(nextpageurl);
      resolve(temp_next_data);
    }, 5000);
  });
  return promise;
};

exports.addListingfromGoogle = async (req, res, next) => {
  let cat = req.body.category;
  var pagetoken = "";
  req.listings = [];
  let json = [];
  let temp_next_data,
    temp_data = null;
  let request_count = 1;
  try {
    url =
      "https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cat}+in+lagos&fields=rating,formatted_phone_number,address_component,opening_hours,website,restaurant,opening_hours&key=" +
      process.env.GOOGLE_KEY;

    temp_data = await helper.getRequest(url);
    json.push(...temp_data.results);
    let next_token = temp_data.next_page_token ? true : false;
    pagetoken = temp_data.next_page_token;
    while (next_token) {
      request_count += 3;
      nextpageurl =
        "https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cat}+in+lagos&fields=rating,formatted_phone_number,address_component,opening_hours,website,restaurant,opening_hours&key=" +
        process.env.GOOGLE_KEY +
        "&pagetoken=" +
        pagetoken +
        "&request_count=" +
        request_count;
      temp_next_data = await this.doSettimeout(nextpageurl);
      // console.log(temp_next_data);
      // console.log("next ", pagetoken);
      json.push(...temp_next_data.results);
      next_token = temp_next_data.next_page_token ? true : false;
      pagetoken = temp_next_data.next_page_token
        ? temp_next_data.next_page_token
        : "false";
    }
    req.listings = [...json];
    console.log("found listing ", req.listings.length);
    next();
  } catch (error) {
    res.send(error.message);
  }
};

exports.signout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    res.send(error.message);
  }
};

exports.getSignIn = async (req, res, next) => {
  try {
    res.render("admin-login");
  } catch (error) {
    res.send(error.message);
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      email
    });
    if (admin) {
      const isValidPassword = await admin.validatePassword(password);
      if (isValidPassword) {
        req.session.adminId = admin._id;
        return res.redirect("/admin/listings");
      } else {
        req.flash("signinError", "Wrong Email Address or Password");
        res.redirect("back");
      }
    } else {
      req.flash("signinError", "Wrong Email Address or Password");
      res.redirect("back");
    }
  } catch (error) {
    next(error);
  }
};

exports.createSuperadmin = async (req, res, next) => {
  try {
    let body = {};
    body.email = "admin@hotspot.com";
    body.password = "password";
    const adminUser = await new Admin(body).save();
    res.send("saved");
  } catch (error) {
    res.send(error.message);
  }
};

exports.addListingtodb = async (req, res, next) => {
  try {
    const listings = req.listings;
    await Promise.all(
      listings.map(async listing => {
        return await new Listing({
          title: listing.name,
          tags: listing.types,
          category: listing.types[0],
          info: {
            address: listing.formatted_address,
            price: listing.price_level || 0,
            country: "Nigeria",
            state: "Lagos",
            coordinates: {
              lat: listing.geometry.location.lat,
              lon: listing.geometry.location.lng
            }
          }
        }).save();
      })
    );
    // console.log(req.listings.length);
    res.redirect("/admin/listings");
  } catch (error) {
    console.log(error);
  }
};

exports.uploadHeader = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      slug: req.params.slug
    });
    if (listing.header) {
      await deleteUpload(listing.header.public_id);
    }
    const image = await upload(req.files.header);
    if (image.public_id == null || image.url == null) {
      next(ErrorHandler("Serious error fam", 404));
    }
    await listing.updateOne({
      header: {
        public_id: image.public_id,
        url: image.url,
        secure_url: image.secure_url
      }
    });
    req.flash(
      "uploadHeaderSuccess",
      "Header Image has been successfully uploaded"
    );
    return res.redirect("back");
  } catch (error) {
    req.flash("uploadHeaderError", "Error occured, please try again");
    return res.redirect("back");
  }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      slug: req.params.slug
    });
    for (const image in req.files) {
      if (listing.images.length >= 5) {
        return res
          .status(401)
          .send("Error : Maximum Images reached, delete some");
      } else {
        const result = await upload(req.files[image]);
        if (result.public_id == null || result.url == null) {
          return res
            .status(401)
            .send("Error uploading images, please try again");
        }
        await listing.update({
          $push: {
            images: {
              public_id: result.public_id,
              url: result.url,
              secure_url: result.secure_url
            }
          }
        });
      }
    }
    res.send("Upload Complete");
  } catch (error) {
    res.status(401).send("Error occured, please retry");
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const id = req.body.id;
    const listing = await Listing.findOne({
      slug: req.params.slug
    });
    if (id) {
      await deleteUpload(id);
    } else {
      return res.status(401).send("Error no ID provided");
    }
    await listing.updateOne({
      $pull: {
        images: {
          public_id: id
        }
      }
    });
    res.status(200).send("Delete Successful");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addListingtoAlgolia = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    index.addObjects(listings);
    res.send("done");
  } catch (error) {
    res.send(error.message);
  }
};

exports.getVerifiedListings = async (req, res, next) => {
  try {
    const verifications = await Verify.find();
    res.render("admin-verify", { verifications });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getVerifiedListing = async (req, res, next) => {
  try {
    var id = req.params.id;
    const verification = await Verify.findOne({ _id: id });
    const listing = await Listing.findOne({ _id: verification.listing_id });
    res.render("verify-details", { verification, listing });
  } catch (e) {
    console.log(e.message);
  }
};

exports.updateVerification = async (req, res, next) => {
  try {
    var verificationid = req.params.verificationid;
    var verify = await Verify.findByIdAndUpdate(verificationid, req.body);

    var listingid = verify.listing_id;
    var owner_id = verify.owner;
    let user = await User.findById(owner_id);
    var listing_exists = user.listings.filter(x =>
      x.listing_id.toString() === listingid.toString() ? (x.status = true) : ""
    );
    console.log("listing ", listing_exists);
    if (listing_exists != undefined && listing_exists.length > 0) {
      console.log("true");
      await User.findByIdAndUpdate(user._id, user);
      req.flash("successVerified", "You have successfully verified");
      res.redirect("back");
    } else {
      req.flash(
        "errorverifying",
        "There was an error verifying. Try again later"
      );
      res.redirect("back");
    }
  } catch (e) {
    console.log(e.message);
  }
};
