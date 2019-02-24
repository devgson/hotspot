const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifiedListingSchema = new Schema({
    listing_name: {
        type: String
    },
    listing_id: {
        type: Schema.Types.ObjectId,
        ref: "listing"
    },
    verification_documents: [],
    date_verified: {
        type: Date
    },
    verification_status: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})


VerifiedListingSchema.pre('find', function (next) {
    this.populate('user');
    next();
  })
  
  VerifiedListingSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
  })
  
  const VerifiedListing = mongoose.model("review", VerifiedListingSchema);
  
  module.exports = VerifiedListing;