const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    default: "gabadin"
  }
});


AdminSchema.pre('save', async function (next) {
  const admin = this;
  const hash = await bcrypt.hash(admin.password, 10);
  admin.password = hash;
  return next();
});

AdminSchema.methods.validatePassword = async function (password) {
  const admin = this;
  const check = await bcrypt.compare(password, admin.password);
  return check;
}


const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;