const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
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
    city: {
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
    }
  },
  category: {
    type: String
  },
  tags: [String],
  images: [String],
  header_image: {
    type: String
  },
  hours: [
    {
      type: Schema.Types.Mixed
    }
  ],
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
  }
});

const Listing = mongoose.model("listing", ListingSchema);

module.exports = Listing;
