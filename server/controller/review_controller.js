const Review = require('../models/review_model');

exports.addReview = async (req, res, next) => {
  try {
    const user = req.session.userId;
    const body = {
      user,
      listing: req.params.listing,
      ...req.body
    }
    const review = await new Review(body).save();
    res.redirect('back');
  } catch (error) {
    res.send(error.message);
  }
}

exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const deleteReview = await Review.findByIdAndRemove(reviewId);
    res.redirect('back');
  } catch (error) {
    res.send(error.message);
  }
}

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.find().populate('user');
    res.json(review);
  } catch (error) {
    res.send(error.message);
  }
}