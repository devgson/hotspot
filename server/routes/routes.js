const router = require("express").Router();

const passport = require("passport");
const user = require("../controller/user_controller");
const admin = require("../controller/admin_controller");
const listing = require("../controller/listing_controller");
const review = require("../controller/review_controller");

router.get("/", listing.index);

// router.get('/listings', (req, res) => {
//   res.render('grid-search');
// })

router.get("/listings", listing.getfindListings);
router.get("/api/search", listing.autoSearch);
/* User Authentication Routes */

router.get("/register", user.redirectIfLoggedIn, user.userSignupLogin);
router.get("/profile", user.isLoggedIn, user.userProfile);
router.post("/profile/:userId", user.isLoggedIn, user.updateUserProfile);
router.get("/signout", user.isLoggedIn, user.signout);

router.get("/add-listing", (req, res) => {
  res.render("add-listing");
});

router.post("/search-listings", listing.findListings);

router.get("/search-listings", listing.getfindListings);
router.get("/category/:category", listing.getCategory);

router.get("/bookmarks", user.isLoggedIn, listing.getBookmarks);

router.get("/profile-social", (req, res) => {
  res.render("profile-social", { user: req.session.facebook_social });
});
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
    scope: ["https://www.googleapis.com/auth/plus.login"]
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

router.get("/messages", (req, res) => {
  res.render("messages");
});

router.get("/mylistings", user.isLoggedIn, user.getUserListings);

router.post("/verify", user.isLoggedIn, user.VerifyProcess);

router.post(
  "/verify-upload/:listingid",
  user.isUserLoggedIn,
  user.uploadVerification
);

/* Listing Routes */
router.get("/listing/:slug", listing.getListing);
router.post("/api/bookmark/:listingId", user.bookmarkListing);
router.post("/api/verify/:listingid", user.isUserLoggedIn, user.claimListing);

/* Review Routes */
router.get("/review", review.getReview);
router.post("/review/:listing", user.isUserLoggedIn, review.addReview);
router.get("/review/delete/:reviewId", review.deleteReview);

/* Admin Routes */
router.get("/admin/dashboard", admin.isAdminLoggedIn, admin.dashboard);
router.get(
  "/admin/verification",
  admin.isAdminLoggedIn,
  admin.getVerifiedListings
);
router.get(
  "/admin/verification/:id",
  admin.isAdminLoggedIn,
  admin.getVerifiedListing
);
router.get("/admin/add-listing", admin.isAdminLoggedIn, admin.getAddListing);
router.get(
  "/admin/edit-listing/:listing",
  admin.isAdminLoggedIn,
  admin.getEditListing
);
router.post("/admin/add-listing", admin.isAdminLoggedIn, admin.postAddListing);
router.post(
  "/admin/edit-listing/:listing",
  admin.isAdminLoggedIn,
  admin.editListing
);
router.post(
  "/admin/update-verification/:verificationid",
  admin.isAdminLoggedIn,
  admin.updateVerification
);

router.post("/admin/upload-header/:slug", admin.uploadHeader);
router.post("/admin/upload-image/:slug", admin.uploadImages);
router.post("/admin/delete-image/:slug", admin.deleteImage);
/*create superadmin*/
router.get("/admin/create", admin.createSuperadmin);

router.get("/admin", admin.isAdminLoggedIn, admin.getAllListings);

router.get("/admin/logout", admin.isAdminLoggedIn, admin.signout);

router.get("/admin/login", admin.redirectIfLoggedIn, admin.getSignIn);
router.post("/admin/login", admin.postSignIn);

router.get("/admin/algolia", admin.addListingtoAlgolia);
router.get("/admin/listings", admin.isAdminLoggedIn, admin.getAllListings);
router.get(
  "/admin/delete-listing/:listing",
  admin.isAdminLoggedIn,
  admin.DeleteListing
);
router.get(
  "/admin/populate-listings",
  admin.isAdminLoggedIn,
  admin.addListingfromGoogle,
  admin.addListingtodb
);

/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;
