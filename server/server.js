var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');


/*Configuring the database and user model with mongoose and connect to MongoDB */

var config = require('./config');

var User = mongoose.model('User',new mongoose.Schema({
  instagramId: { type: String, index: true },
  email :  { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  username: String,
  fullname: String,
  picture: String,
  accessToken: String
}));

mongoose.connect(config.db);

function createToken(user){
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user_id
  };
  return jwt.encode(payload, config.tokenSecret);
}


/*
jwt-simple methods:
  an object that gets encoded and decoded is called JWT claims.
  encode()
  decode()

*/

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function(){
  console.log('Dropping you a Express server ' + app.get('port'));

})
