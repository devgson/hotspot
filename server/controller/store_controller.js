const Store = require('../models/listing_model');


exports.postAddListing = async (req, res, next) => {
    try {
      req.body.owner = req.session.userID;
      const store = await new Store(req.body).save();
      res.redirect('admin-listings');
    } catch (error) {
      // next(ErrorHandler(error));
      // console.log(error);
      // document.write(error);
      res.send(error.message);
    }
  };

  
exports.getListing = async (req, res, next) => {
  try {
    const listings = await Store.find();
    res.render('admin-listings',{listings});
  } catch (error) {
    // next(ErrorHandler(error));
    // console.log(error);
    // document.write(error);
    res.send(error.message);
  }
};