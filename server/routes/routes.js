const router = require('express').Router();

const user = require('../controller/user_controller');
const admin = require('../controller/admin_controller');
const listing = require('../controller/listing_controller');
const review = require('../controller/review_controller');

router.get('/', (req, res) => {
  res.render('index.pug');
})

router.get('/grid-search', (req, res) => {
  res.render('grid-search');
})

/* User Authentication Routes */
router.get('/register', user.redirectIfLoggedIn, user.userSignupLogin);
router.get('/profile', user.isUserLoggedIn, user.userProfile);
router.get('/signout', user.isUserLoggedIn, user.signout);

router.get('/add-listing', (req, res) => {
  res.render('add-listing');
});

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
router.get('/admin/add-listing', admin.getAddListing);
router.get('/admin/edit-listing/:listing', admin.getEditListing);

router.get('/admin/listings', admin.getAllListings);

router.get('/admin/listings', admin.getAllListings);
router.get('/admin/delete-listing/:listing', admin.DeleteListing);
router.get('/admin/populate-listings', admin.addListingfromGoogle, admin.addListingtodb);

router.post('/admin/add-listing', admin.postAddListing);
router.post('/admin/edit-listing/:listing', admin.editListing);

/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;