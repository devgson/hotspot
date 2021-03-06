const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: "User not Found : Review must belong to a User"
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing",
    required: "Listing not Found : Review must belong to a Listing"
  },
  content: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ReviewSchema.pre('find', function (next) {
  this.populate('user');
  next();
})

ReviewSchema.pre('findOne', function (next) {
  this.populate('user');
  next();
})

const Review = mongoose.model("review", ReviewSchema);

module.exports = Review;