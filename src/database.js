const mongoose = require('mongoose');
const helpers = require('./backendHelpers.js')
const db = mongoose.connect(process.env.MONGO_DATABASE);
const dotenv = require('dotenv');
dotenv.config();

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  customerID: String,
  subscriberID: String,
  email: String,
  newUser: Boolean,
  canceled: Boolean,
  dateJoined: Date,
});
let User = mongoose.model('User', userSchema);
exports.User = User;