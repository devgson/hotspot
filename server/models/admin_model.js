const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  password: {
    type: String,
    default: "gabadin"
  }
});

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
