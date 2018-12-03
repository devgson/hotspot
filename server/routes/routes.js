const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index.pug');
})

router.get('/listing-detail', (req, res) => {
  res.render('listing-detail');
})

router.get('/grid-search', (req, res) => {
  res.render('grid-search');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/add-listing', (req, res) => {
  res.render('add-listing');
})

router.get('/messages', (req, res) => {
  res.render('messages');
})
/*router.get('/row-search', (req, res) => {
  res.render('row-search');
})*/
module.exports = router;