const router = require('express').Router();

const user = require('../controller/user_controller');
const admin = require('../controller/admin_controller');
const listing = require('../controller/listing_controller');

router.get('/', (req, res) => {
  res.render('index.pug');
})

router.get('/grid-search', (req, res) => {
  res.render('grid-search');
})

router.get('/listing/:slug', listing.getListing);

/* User Authentication Routes */
router.get('/register', user.redirectIfLoggedIn, user.userSignupLogin);
router.get('/profile', user.isUserLoggedIn, user.userProfile);
router.get('/signout', user.isUserLoggedIn, user.signout);

router.get('/add-listing', (req, res) => {
  res.render('add-listing');
});

router.get('/admin-listings',store.getListing);

router.get('/populate-listings',store.addListingfromGoogle, store.addListingtodb);

router.post('/add-listing', store.postAddListing );
router.post('/signin', user.redirectIfLoggedIn, user.signin);
router.post('/signup', user.redirectIfLoggedIn, user.signup);

router.get('/messages', (req, res) => {
  res.render('messages');
})

/* Admin Routes */
router.get('/admin/add-listing', admin.getAddListing);
router.get('/admin/listings', admin.getAllListings);

router.post('/admin/add-listing', admin.postAddListing);

/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;