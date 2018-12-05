const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    trim: true,
    required: true
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
    country: {
      type: String,
      trim: true
    },
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
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: "listing"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return next();
});

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const check = await bcrypt.compare(password, user.password);
  return check;
}

const User = mongoose.model("user", UserSchema);

module.exports = User;