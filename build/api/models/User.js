'use strict';

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, },
  email: { type: String, unique: true},
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  tokens: Array,

  profile: {
    name: { type: String, default: ''},
    gender: { type: String, default: ''},
    location: { type: String, default: ''},
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
});
// { timestamps: true }

// Validate email is not taken
userSchema.path('email').validate(function(value, response){
  let self = this;
  this.constructor.findOne({email: value}, function(err, user){
    if(err) throw err;
    if (user){
      if (self.id === user.id) return response(true)
      return false
    }
    response(false)
  });
}, 'The specified email address is already in use.');


//Pre-save hook
userSchema.pre('save', function(next){
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt){
    if (err){
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err){
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

let User = mongoose.model('User', userSchema);
module.exports = User;
