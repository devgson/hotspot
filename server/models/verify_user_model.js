const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifiedListingSchema = new Schema({
    owner_first_name: {
        type: String

    },
    owner_last_name: {
        type: String

    },
    listing_name: {
        type: String
    },
    listing_image: {
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
    owner: {
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

VerifiedListingSchema.pre('save', function (next) {
    this.populate('user');
    this.populate('listing');
    next();
})

const VerifiedListing = mongoose.model("VerifiedListing", VerifiedListingSchema);

module.exports = VerifiedListing;