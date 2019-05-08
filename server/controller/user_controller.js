const User = require("../models/user_model");
const VerifiedListing = require("../models/verify_user_model");
const Listing = require("../models/listing_model");
const { cloudinary, flat, upload, deleteUpload } = require("../helper/helper");

exports.isUserLoggedIn = async (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    req.flash("signinError", "Please Sign in");
    res.redirect("/?showdefaultmodal=true");
  }
};

exports.isLoggedIn = async (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  req.flash("signinError", "Please Sign in");
  res.redirect("/?showdefaultmodal=true");
};

exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/profile");
  else {
    next();
  }
};

exports.userProfile = async (req, res) => {
  const user = res.locals.currentUser;
  res.render("profile", {
    user
  });
};

exports.userSignupLogin = (req, res) => {
  res.render("register-new");
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email
    });
    if (user) {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        req.session.userId = user._id;
        return res.redirect("/profile");
      } else {
        req.flash("signinError", "Wrong Email Address or Password");
        res.redirect("/?showdefaultmodal=true");
      }
    } else {
      req.flash("signinError", "Wrong Email Address or Password");
      res.redirect("/?showdefaultmodal=true");
    }
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const userInfo = req.body;
    if (userInfo.password !== userInfo.confirm_password) {
      req.flash(
        "signupError",
        "Password and Confirm Password field do not match"
      );
      return res.redirect("back");
    }
    const user = await new User(req.body).save();
    req.session.userId = user._id;
    res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
    req.flash("signupError", error.message);
    return res.redirect("back");
  }
};

exports.signout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    const confirmNewPassword = req.body.confirm_new_password;
    if (newPassword !== confirmNewPassword) {
      req.flash("profileEditError", "New passwords do not match");
      return res.redirect("back");
    }
    if (oldPassword && newPassword && confirmNewPassword) {
      const doPasswordsMatch = await user.validatePassword(oldPassword);
      if (doPasswordsMatch) {
        const hashedPassword = await user.hashNewPassword(newPassword);
        req.body.password = hashedPassword;
      } else {
        req.flash("profileEditError", "Old password is incorrect");
        return res.redirect("back");
      }
    }
    const userUpdated = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        upsert: true
      }
    );
    req.flash("profileEditSuccess", "Profile Updated Successfully");
    res.redirect("back");
  } catch (error) {
    req.flash("profileEditError", "Error occured, please try again");
    res.redirect("back");
  }
};

exports.VerifyProcess = async (req, res, next) => {
  try {
    var listingid = req.body.listingid;
    var listing = await Listing.findById(listingid);
    const user = res.locals.currentUser;
    console.log("verify listing ", listing);
    res.render("verify-listing", { listingid, user, listing });
  } catch (e) {
    console.log("error");
  }
};

exports.uploadVerification = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingid);
    const user = res.locals.currentUser;
    var listing_details = {
      title: listing.title,
      listing_id: listing._id,
      owner: user._id,
      verification_documents: []
    };
    for (const image in req.files) {
      const result = await upload(req.files[image]);
      if (result.public_id == null || result.url == null) {
        return res.status(401).send("Error uploading images, please try again");
      }
      var documents = {
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url
      };
      listing_details.verification_documents.push(documents);
    }
    console.log(listing_details);
    await new VerifiedListing(listing_details).save();
    res.send("Upload Complete");
  } catch (error) {
    console.log("error is ", error.message);
  }
};

exports.claimListing = async (req, res, next) => {
  try {
    var user = res.locals.currentUser;
    // const user_listings = user.listings[0]]
    console.log("bosy ", req.body);
    var current_listing = {
      listing_id: req.params.listingid,
      status: false,
      title: req.body.title,
      category: req.body.listing_category,
      listing_image: req.body.listing_image,
      listing_slug: req.body.listing_slug
    };
    var listing_exists = user.listings.filter(
      x => x.listing_id === req.params.listingid
    );
    if (listing_exists.length === 0) {
      var Updateuser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { listings: current_listing } }
      );
    }

    var exists = await VerifiedListing.findOne({
      listing_id: req.params.listingid
    });
    req.body["verification_status"] = false;
    if (exists) {
      var listing = await VerifiedListing.findOneAndUpdate(
        { listing_id: req.params.listingid },
        { $set: req.body }
      );

      req.flash(
        "successVerify",
        "Your verification Request has been sent Successfully"
      );
      res.redirect("/profile");
      console.log("entered 1");
    } else {
      console.log("entered 2");
      console.log(req.body);
      req.body.listing_id = req.params.listingid;
      req.body.owner = user._id;
      await new VerifiedListing(req.body).save();
      req.flash(
        "successVerify",
        "Your verification Request has been sent Successfully"
      );
      res.redirect("/profile");
    }
  } catch (e) {
    console.log(e.message);
  }
};

exports.getUserListings = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    var user_listings = user.listings;
    console.log(user_listings);
    res.render("mylistings", { user_listings });
  } catch (e) {
    console.log("error");
  }
};

exports.bookmarkListing = async (req, res, next) => {
  try {
    const listing = req.params.listingId;
    const bookmarks = res.locals.currentUser.bookmarks.map(_id =>
      _id.toString()
    );
    const operator = bookmarks.includes(listing.toString())
      ? "$pull"
      : "$addToSet";
    const saveBookmark = await User.findByIdAndUpdate(
      res.locals.currentUser._id,
      {
        [operator]: {
          bookmarks: listing
        }
      }
    );
    res.json(saveBookmark);
  } catch (error) {
    res.send(error.message);
  }
};
