const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    required: "Please enter a Valid email",
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  info: {
    phone: {
      type: String
    }
  },
  location: {
    country: {
      type: String,
      trim: true
    }
  },
  price: {
    type: Number
  },
  social_media: {
    twitter: {
      access_token: String,
      link: String
    },
    facebook: {
      access_token: String,
      link: String
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
  ]
});

UserSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return next();
  } else {
    next();
  }
});

UserSchema.pre("find", function(next) {
  this.populate("bookmarks");
  next();
});

UserSchema.pre("findOne", function(next) {
  this.populate("bookmarks");
  next();
});

UserSchema.methods.hashNewPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = async function(password) {
  const user = this;
  const check = await bcrypt.compare(password, user.password);
  return check;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
