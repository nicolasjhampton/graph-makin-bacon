"use strict";

var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
        // validate: {
        //     validator: function(value) {
        //         return /^[a-z0-9_\-.]+/.test(value);
        //     }
        // }
    },
    profilePic: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);

// UserSchema.pre("save", function(next) {
//   var user = this;
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       user.password = hash;
//       next();
//     });
//   });
// });

// UserSchema.statics.authenticate = function(credentials, callback) {
//   if (!credentials) return callback(null, false);
//   this.findOne({ username: credentials.name }).exec(function(err, user) {
//     if (!user || err) return callback(null, false);
//     bcrypt.compare(credentials.pass, user.password, function(
//       err2,
//       authorization
//     ) {
//       if (err2) return callback(null, false);
//       return callback(null, authorization, user);
//     });
//   });
// };
