const router = require('express').Router();

const user = require('../controller/user_controller');
const store = require('../controller/store_controller');

router.get('/', (req, res) => {
  res.render('index.pug');
})

router.get('/listing-detail', (req, res) => {
  res.render('listing-detail');
})

router.get('/grid-search', (req, res) => {
  res.render('grid-search');
})

router.get('/register', user.redirectIfLoggedIn, user.userSignupLogin);
router.get('/profile', user.isUserLoggedIn, user.userProfile);

router.get('/signout', user.isUserLoggedIn, user.signout);

router.post('/signin', user.signin);
router.post('/signup', user.signup);
router.get('/add-listing', (req, res) => {
  res.render('add-listing');
});

router.get('/admin-listings',store.getListing);

router.get('/populate-listings',store.addListingfromGoogle, store.addListingtodb);

router.post('/add-listing', store.postAddListing );

router.get('/messages', (req, res) => {
  res.render('messages');
})
/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;