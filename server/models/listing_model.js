const mongoose = require("mongoose");
const mongoolia = require('mongoolia').default;
const validator = require("validator");
const slug = require('slugs');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    algoliaIndex:true
  },
  description: {
    type: String,
    trim: true,
    algoliaIndex:true
  },
  slug: {
    type: String,
    algoliaIndex:true
  },
  info: {
    number: {
      type: String,
      algoliaIndex:true
    },
    email: {
      type: String,
      algoliaIndex:true
    },
    website: {
      type: String,
      algoliaIndex:true
    },
    state: {
      type: String,
      trim: true,
      algoliaIndex:true
    },
    country: {
      type: String,
      trim: true,
      algoliaIndex:true
    },
    address: {
      type: String,
      trim: true,
      algoliaIndex:true
    },
    coordinates: {
      lat: {
        type: Number,
        algoliaIndex:true
      },
      lon: {
        type: Number,
        algoliaIndex:true
      }
    },
    type: Object,
    algoliaIndex:true,
  },
  category: {
    type: String,
    algoliaIndex:true
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
    default: Date.now,
    algoliaIndex:true
  }
});

ListingSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "listing"
});

ListingSchema.pre('find', function (next) {
  this.populate('reviews');
  next();
})

ListingSchema.pre('findOne', function (next) {
  this.populate('reviews');
  next();
})

ListingSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = slug(this.title);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const listingWithSlug = await this.constructor.find({
    slug: slugRegEx
  });
  if (listingWithSlug.length) {
    this.slug = `${this.slug}-${listingWithSlug.length + 1}`;
  }
  next();
});

ListingSchema.plugin(mongoolia, {
  appId: process.env.ALGOLIA_ID,
  apiKey: process.env.ALGOLIA_ADMIN,
  indexName: 'listings'
})

const Listing = mongoose.model("listing", ListingSchema);

module.exports = Listing;