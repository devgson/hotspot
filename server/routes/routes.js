const router = require('express').Router();

const user = require('../controller/user_controller');
const admin = require('../controller/admin_controller');
const listing = require('../controller/listing_controller');
const review = require('../controller/review_controller');

router.get('/', (req, res) => {
  res.render('index.pug');
})

router.get('/listings', (req, res) => {
  res.render('grid-search');
})

/* User Authentication Routes */
router.get('/register', user.redirectIfLoggedIn, user.userSignupLogin);
router.get('/profile', user.isUserLoggedIn, user.userProfile);
router.post('/profile/:userId', user.isUserLoggedIn, user.updateUserProfile);
router.get('/signout', user.isUserLoggedIn, user.signout);

router.get('/add-listing', (req, res) => {
  res.render('add-listing');
});


router.post('/search-listings', listing.findListings);


router.get('/search-listings', listing.getfindListings);
router.get('/category/:category', listing.getCategory);

router.post('/signin', user.redirectIfLoggedIn, user.signin);
router.post('/signup', user.redirectIfLoggedIn, user.signup);

router.get('/messages', (req, res) => {
  res.render('messages');
})

/* Listing Routes */
router.get('/listing/:slug', listing.getListing);
router.post('/api/bookmark/:listingId', user.bookmarkListing);

/* Review Routes */
router.get('/review', review.getReview);
router.post('/review/:listing', user.isUserLoggedIn, review.addReview);
router.get('/review/delete/:reviewId', review.deleteReview);

/* Admin Routes */
router.get('/admin/add-listing', admin.isAdminLoggedIn, admin.getAddListing);
router.get('/admin/edit-listing/:listing', admin.isAdminLoggedIn, admin.getEditListing);
router.post('/admin/add-listing', admin.isAdminLoggedIn, admin.postAddListing);
router.post('/admin/edit-listing/:listing', admin.isAdminLoggedIn, admin.editListing);

router.post('/admin/upload-header/:slug', admin.uploadHeader);
router.post('/admin/upload-image/:slug', admin.uploadImages);
router.post('/admin/delete-image/:slug', admin.deleteImage);
/*create superadmin*/
router.get('/admin/create', admin.createSuperadmin);

router.get('/admin', admin.isAdminLoggedIn, admin.getAllListings);

router.get('/admin/logout', admin.isAdminLoggedIn, admin.signout);

router.get('/admin/login', admin.redirectIfLoggedIn, admin.getSignIn)
router.post('/admin/login', admin.postSignIn);

router.get('/admin/algolia', admin.addListingtoAlgolia);
router.get('/admin/listings', admin.isAdminLoggedIn, admin.getAllListings);
router.get('/admin/delete-listing/:listing', admin.isAdminLoggedIn, admin.DeleteListing);
router.get('/admin/populate-listings', admin.isAdminLoggedIn, admin.addListingfromGoogle, admin.addListingtodb);

/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;