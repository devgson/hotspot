const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user_model');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {
                try {

                
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'email': req.body.email }, async function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    // check to see if theres already a user with that email
                    if (user) {
                        console.log("error is new", err);
                        return done(null, false, req.flash('signupError', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User(req.body);

                        // set the user's local credentials
                        // newUser.password = newUser.hashNewPassword(req.body.password);

                        // save the user
                        await newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser, req.flash('succesfulSocial', 'Congrats!!, you have signed up succesfully'));
                        });


                        req.session.userId = newUser._id;
                    }

                });
            }
            catch(e){
                return done(e);
            }
            });

        }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form
            try {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email': req.body.email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('signinError', 'User does not exist.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validatePassword(password))
                    return done(null, false, req.flash('signinError', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                req.session.userId = user._id;
                return done(null, user);
            });
        }
        catch(e){
            return done(e);
        }
        }));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['last_name', 'first_name', 'link', 'emails'],
        passReqToCallback: true
    },
       async function (req, accessToken, refreshToken, profile, done) {
           try{

           
           await User.findOne({ 'email': profile._json.email }, async function (err, user) {
                // if there are any errors, return the error
                console.log(profile);
                if (err)
                    return done(err);
                console.log(err);
                // check to see if theres already a user with that email
                if (!user) {
                    var newUser =
                    {
                        'first_name': profile._json.first_name,
                        'last_name': profile._json.last_name,
                        'email': profile._json.email,
                        'social_media_token': accessToken,
                        'social_media_facebook_link': profile.link
                    };
                    console.log('new usewrr ' + JSON.stringify(newUser));
                    req.session.social_user = await newUser;
                    return done(null, false, req.flash('socialUser', 'Just One last step and you are good to go.'));
                }
                req.session.userId = user._id;
                return done(null, user);
            });
        }
        catch(e) {
            return done(e);
        }
    }
    ));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CONSUMER_KEY,
        clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true
    },
        async function (req,token, tokenSecret, profile, done) {
            try{
            console.log(profile._json.emails[0].value);
           await User.findOne({ 'email': profile._json.emails[0].value }, async function (err, user) {
                // if there are any errors, return the error
                console.log("profile is ",profile);
                if (err)
                    return done(err);
                console.log(err);
                // check to see if theres already a user with that email
                if (!user) {
                    var newUser =
                    {
                        'first_name': profile._json.name.givenName,
                        'last_name': profile._json.name.familyName,
                        'email': profile._json.emails[0].value,
                        'social_media_google_link': profile._json.url
                    };
                    console.log('new usewrr ' + JSON.stringify(newUser));
                    req.session.social_user = await newUser;
                    return done(null, false, req.flash('socialUser', 'Just One last step and you are good to go.'));
                }
                req.session.userId = user._id;
                return done(null, user);
            });
        }
        catch(e){
            console.log(e);
        }
        }
    ));

};