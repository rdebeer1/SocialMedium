const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const db = require('./database.js');
const moment = require('moment');
dotenv.config();

function saveUserIntoDataBase(username, password, email, callback) {
  db.User.findOne({ username: username }, function (err, result) {
    if (result === null) {
      db.User.findOne({ email: email }, (err, result) => {
        if (result === null) {
          const newUser = new db.User({
            username: username,
            password: password,
            email: email,
            newUser: true,
            canceled: false,
            dateJoined: moment.now()
          });
          newUser.save(() => {
            console.log('user saved in saveUserIntoDataBase');
            callback('User saved in saveUserIntoDataBase');
          });
        } else if (err) {
          callback('Error on looking up email in database');
        } else {
          callback('Email already exists');
        }
      })
    } else if (err) {
      callback('Error on looking up user in database');
    } else {
      callback('Username already exists');
    }
  });
}

function checkPassword(username, password) {
  console.log(password)
  return db.User.findOne({ username: username })
    .then(doc => {
      console.log('THE DOC:', doc);
      console.log('password in checkPassword:', password);
      return bcrypt.compareSync(password, doc.password, (err, res) => {
        return res;
      });
    })
    .catch(error => {
      console.log(error);
    })
}

function hashPassword(userObj) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(userObj.password, salt);
  userObj.password = hash;
}
function getUserProfile(username, callback) {
  db.User.findOne({ username: username })
    .then(result => {
      console.log(result);
      callback(null, result);
    })
    .catch(err => {
      console.log('error in getUserProfile:', err);
      callback(err);
    })
}

exports.getUserProfile = getUserProfile;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.saveUserIntoDataBase = saveUserIntoDataBase;