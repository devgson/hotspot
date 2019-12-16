const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifiedListingSchema = new Schema({
  listing_id: {
    type: Schema.Types.ObjectId,
    ref: "listing"
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing"
  },
  verification_documents: [],
  date_verified: {
    type: Date
  },
  verification_status: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

VerifiedListingSchema.pre("find", function(next) {
  this.populate("user");
  this.populate("listing");
  next();
});

VerifiedListingSchema.pre("findOne", function(next) {
  this.populate("user");
  this.populate("listing");
  next();
});

VerifiedListingSchema.pre("save", function(next) {
  this.populate("user");
  this.populate("listing");
  next();
});

const VerifiedListing = mongoose.model(
  "VerifiedListing",
  VerifiedListingSchema
);

module.exports = VerifiedListing;
