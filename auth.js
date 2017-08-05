"use strict";

/** Authentication */
const config = require("./config");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { Users } = require("./models");

/**
 * Authentication Strategy
 */
passport.use(
    new GoogleStrategy(
        {
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: "https://localhost:3000/auth/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            Users.findOne({
                _id: profile.id
            }).exec((err, foundUser) => {
                if (!foundUser) {
                    debugger;
                    Users.create(
                        {
                            _id: profile.id,
                            username: profile.displayName.split(" ").join("."),
                            profilePic: profile.photos[0].value,
                            name: profile.name.givenName
                        },
                        (err, userCreated) => {
                            if (err) cb(err);
                            cb(null, userCreated);
                        }
                    );
                } else {
                    cb(err, foundUser);
                }
            });
        }
    )
);

passport.serializeUser(function(user, done) {
    debugger;
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;
