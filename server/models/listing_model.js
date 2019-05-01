const mongoose = require("mongoose");
const mongoolia = require("mongoolia").default;
const validator = require("validator");
const slug = require("slugs");

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    text: true
  },
  description: {
    type: String,
    trim: true,
    text: true
  },
  slug: {
    type: String
  },
  info: {
    number: {
      type: String
    },
    email: {
      type: String
    },
    website: {
      type: String
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number
      },
      lon: {
        type: Number
      }
    },
    price: Number,
    type: Object
  },
  category: {
    type: String,
    lowercase: true
  },
  tags: [String],
  images: [],
  header: {},
  hours: {
    type: Schema.Types.Mixed
  },
  social_media: {
    twitter: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: String
  }
});

ListingSchema.index({
  title: "text",
  description: "text"
});

ListingSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "listing"
});

ListingSchema.pre("find", function(next) {
  this.populate("reviews");
  next();
});

ListingSchema.pre("findOne", function(next) {
  this.populate("reviews");
  next();
});

ListingSchema.pre("save", async function(next) {
  if (!this.isModified("title")) {
    return next();
  }
  this.slug = slug(this.title);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const listingWithSlug = await this.constructor.find({
    slug: slugRegEx
  });
  if (listingWithSlug.length) {
    this.slug = `${this.slug}-${listingWithSlug.length + 1}`;
  }
  next();
});

const Listing = mongoose.model("listing", ListingSchema);

module.exports = Listing;
