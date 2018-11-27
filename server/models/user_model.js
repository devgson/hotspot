const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
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
  photo: {
    type: String
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "listing"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
