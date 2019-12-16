const router = require("express").Router();

const passport = require("passport");
const user = require("../controller/user_controller");
const admin = require("../controller/admin_controller");
const listing = require("../controller/listing_controller");
const review = require("../controller/review_controller");

/* Review Routes */
router.get("/review", review.getReview);
router.get("/review/delete/:reviewId", review.deleteReview);
router.post("/review/:listing", user.isUserLoggedIn, review.addReview);

/* Users Routes */
router.get("/", listing.index);
router.get("/explore", listing.getfindListings);
router.get("/register", user.redirectIfLoggedIn, user.userSignupLogin);
router.get("/profile-social", (req, res) => { res.render("profile-social", { user: req.session.social_user }); });
router.get("/messages", (req, res) => { res.render("messages"); });
router.get("/mylistings", user.isLoggedIn, user.getUserListings);
router.get("/signout", user.isLoggedIn, user.signout);

router.get("/verify/:listingId", user.isLoggedIn, user.verify);
router.post("/verify-upload/:listingId",user.isUserLoggedIn,user.uploadVerification);
router.post("/api/verify/:listingId", user.isUserLoggedIn, user.claimListing);

router.get("/bookmarks", user.isLoggedIn, user.getUsersBookmarks);
router.post("/api/bookmark/:listingId", user.isLoggedIn, user.updateUsersBookmarks);

router.get("/profile", user.isLoggedIn, user.userProfile);
router.post("/profile/:userId", user.isLoggedIn, user.updateUserProfile);


/* Lisiting Routes */
router.get("/api/search", listing.autoSearch);
router.get("/category/:category", listing.getCategory);
router.get("/listing/:slug", listing.getListing);
router.get("/add-listing", (req, res) => { res.render("add-listing"); });

router.get("/search-home-listings", listing.getHomeListings);
router.post("/search-home-listings", listing.findListings);

router.get("/search-listings", listing.getfindListings);
router.post("/search-listings", listing.findListings);

router.get("/update/listing/:slug", user.isLoggedIn, listing.updateUserListing);
router.post("/api/update/:slug", user.isLoggedIn, listing.updateListing);

router.get("/api/filter", listing.getFilters);
router.post("/api/filter", listing.filterSearch);

//router.get("/explore", listing.explore);
//router.get("/explore/location", listing.exploreByLocation);


/* Admin Routes */
router.get("/admin", admin.isAdminLoggedIn, admin.getAllListings);
router.get("/admin/create", admin.createSuperadmin);
router.get("/admin/dashboard", admin.isAdminLoggedIn, admin.dashboard);
router.get("/admin/listings", admin.isAdminLoggedIn, admin.getAllListings);
router.get("/admin/algolia", admin.addListingtoAlgolia);
router.get("/admin/delete-listing/:listing", admin.isAdminLoggedIn, admin.DeleteListing);
router.get("/admin/logout", admin.isAdminLoggedIn, admin.signout);
router.post("/admin/populate", admin.isAdminLoggedIn, admin.addListingfromGoogle, admin.addListingtodb);

router.get("/admin/verification",admin.isAdminLoggedIn,admin.getVerifiedListings);
router.get("/admin/verification/:id",admin.isAdminLoggedIn,admin.getVerifiedListing);
router.get("/admin/verification/:verificationId/:status",admin.isAdminLoggedIn,admin.updateVerification);

router.get("/admin/add-listing", admin.isAdminLoggedIn, admin.getAddListing);
router.post("/admin/add-listing", admin.isAdminLoggedIn, admin.postAddListing);

router.get("/admin/edit-listing/:listing",admin.isAdminLoggedIn,admin.getEditListing);
router.post("/admin/edit-listing/:listing",admin.isAdminLoggedIn,admin.editListing);

router.post("/admin/upload-header/:slug", admin.uploadHeader);
router.post("/admin/upload-image/:slug", admin.uploadImages);
router.post("/admin/delete-image/:slug", admin.deleteImage);

router.get("/admin/login", admin.redirectIfLoggedIn, admin.getSignIn);
router.post("/admin/login", admin.postSignIn);

router.post(
  "/signin",
  passport.authenticate("local-login", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/?showdefaultmodal=true", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/register", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    scope: ["email"],
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/profile-social", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile", // redirect to the secure profile section
    failureRedirect: "/profile-social", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

module.exports = router;
