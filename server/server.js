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

var User = mongoose.model('User', new mongoose.Schema({
    instagramId: {type: String, index: true},
    email: {type: String, unique: true, lowercase: true},
    password: {type: String, select: false},
    username: String,
    fullname: String,
    picture: String,
    accessToken: String
}));

mongoose.connect(config.db);


/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function isAuthenticated(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).send({message: 'You did not provide a JSON Web Token in the Authorization header.'});
    }
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();
    if (now > payload.exp) {
        return res.status(401).send({message: 'Token has expired.'});
    }
    User.findById(payload.sub, function (err, user) {
        if (!user) {
            return res.status(400).send({message: 'User no longer exists.'});
        }
        req.user = user;
        next();
    })
}


/*
 |--------------------------------------------------------------------------
 | JWT Generator
 |--------------------------------------------------------------------------
 */

function createToken(user) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user_id
    };
    return jwt.encode(payload, config.tokenSecret);
}



/*
 |--------------------------------------------------------------------------
 | Sign up using email verification
 |--------------------------------------------------------------------------
 */

    app.post('/auth/login', function(req,res){
        User.findOne({ email:req.body.email }, '+password', function(err, user) {
            if (!user){
                return res.status(401).send({ message: {email: 'Incorrect email'} });
            }
        })
    })






/*
 |--------------------------------------------------------------------------
 |  Create Email and Password Account
 |--------------------------------------------------------------------------
 */

app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken.' });
        }
        var user = new User({
            email: req.body.email,
            password: req.body.password
        });
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                user.save(function() {
                    var token = createToken(user);
                    res.send({ token: token, user: user });
                });
            });
        });
    });
})





var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function () {
    console.log('Dropping you a Express server ' + app.get('port'));

});



