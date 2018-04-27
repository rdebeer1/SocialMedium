const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database.js');
const helpers = require('../backend/backendHelpers.js');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path')
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const moment = require('moment');
const timezone = require('moment-timezone');
dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser('nerfgun'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGO_DATABASE);

app.use(session({
  secret: 'nerfgun',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 60 })
}));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/createAccount', function(req, res) { 
  helpers.hashPassword(req.body)
  const {
    username: username,
    password: password,
    email: email,
  } = req.body;
  
  helpers.saveUserIntoDataBase(username, password, email, function (message) {
    if (message === 'User saved in saveUserIntoDataBase') {
      req.session.regenerate(function(err) {
        if (!err) {
          req.session.username = username;
          console.log('req.session.username:', req.session.username);
          res.send(req.session.username);
        } else {
          console.log('error creating session');
          res.status(400).send('error loggin user in after saving to DB');
        }
      });
    } else {
      res.send(message);
    }
  });
});

app.post('/login', function(req, res) { 
  console.log('req.body.username:', req.body.username);
  console.log('req.body.password:', req.body.password);
  db.User.findOne({username: req.body.username}).exec((err, response) => {
    if (response) {
      helpers.checkPassword(req.body.username, req.body.password)
        .then((boolean) => {
          if (boolean) {
            req.session.regenerate(err => {
              if (!err) {
                req.session.username = req.body.username;
                console.log('login succesful, session created');
                console.log(req.session);
                res.status(202).send(req.session.username);
              } else {
                console.log('error creating session');
              }
            })
          } else {
            res.status(200).send('password does not match');
          }
        })
    } else {
      res.status(200).send('user not found');
    }
  });
});

app.post('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log('error logging out');
      res.send();
    }
    else {
      console.log('session destroyed!');
      res.send();
    }
  });
});

app.post('/userProfile', (req, res) => {
  helpers.getUserProfile(req.body.username, function (err, result) {
    if (err) {
      res.status(400).send('error getting user stats');
    } else {
      res.send(result);
    }
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});