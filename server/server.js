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


var app = express();


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
 |
 |  *this route is only for  checking if the email address is already taken( cannot have multiple
 |   users with the same email.
 |
 |   * It then hashes the password using bcrypt and saves the user to the database.
 |    this route is only responsible for creating a email and password sign up process.
 |
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
});

/*
 |--------------------------------------------------------------------------
 |  Instagram Authentication Process route
 |
 |  Creating a separate route for processing instagram authentication.
 |---------------------------------------------------------------------------
 */
app.post('/auth/instagram',function (req,res){
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

    var params = {
        client_id: req.body.clientId,
        redirect_url: req.body.redirectUri,
        client_secret: config.clientSecret,
        code: req.body.code,
        grant_type: 'authorization_code'
    };

    //Exchange authorization code for access token.

    request.post({ url: accessTokenUrl, form:params, json:true }, function(error,repsonse,body){

        //link user accounts
        if (req.headers.authorization) {

        User.findOne({ instagramId: body.user.id }, function(err,existingUser){

            var token = req.headers.authorization.split(' ')[1];
            var payload =jwt.decode(token,config.tokenSecret);

            User.findById(payload.sub, '+password', function(err,localUser){
                if(!localUser){
                    return res.status(400).send({ message: 'User not found'});
                }

                //Merge the two accounts. Remember that the instagram account
                //takes precedence. Email account will be deleted.

                if(existingUser) {

                    existingUser.email = localUser.email;
                    existingUser.password = localUser.password;

                    localUser.remove();

                    existingUser.save(function(){
                        var token = createToken(existingUser);
                        return res.send({ token: token, user:existingUser });

                    });

                } else {
                    // link current email account with the Instagram profile information.

                    localUser.instagramId = body.user.id;
                    localUser.username = body.user.username;
                    localUser.fullName = body.user.full_name;
                    localUser.picture = body.user.profile_picture;
                    localUser.accessToken = body.access.token;

                    localUser.save(function(){
                        var token= createToken(localUser);
                        res.send({ token: token, user:localUser });
                    });
                }
            });

        });

        } else {
            //or create  a new user account or return an existing one.

            User.findOne({ instagramId: body.user.id }, function(err,existingUser){
                if(existingUser) {
                    var token = createToken(exisitingUser);
                    return res.send({ token: toekn, user:existingUser });
                }

                var user = new User({
                    instagramId: body.user.id,
                    username: body.user.username,
                    fullName:body.user.full_name,
                    accessToken:body.user.profile_picture,
                    picture:body.access_token
                });

                user.save(function(){
                    var token = createToken(user);
                    res.send({ token: token,user:user });
                });
            });

        }
    });
});

    app.get('/api/feed', isAuthenticated, function(req,res){
        var mediaUrl = 'https://api.instagram.com/v1/media/' + req.params.id;
        var params = { access_token: req.user.accessToken };

        request.get({ url: mediaUrl, qs:params, json: true }, function(error,response,body){
            if (!error && response.statusCode == 200) {
                res.send(body.data);
            }
        });
    });

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function () {
    console.log('Dropping you a Express server ' + app.get('port'));

});



