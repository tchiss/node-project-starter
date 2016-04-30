'use strict';

var jwt = require('jsonwebtoken');

var User = require('../models/User');
var config = require('../../../config/env');
var utils = require('./../../utils');


module.exports = {
  create: function(req, res, next){
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    newUser.provider = 'local';
    newUser.role = 'user';
    User.findOne(req.body.email, function(existingUser){
      if (existingUser){
        return res.status(409).send('User already exists !');
      }
      else{
        User.create(newUser, function(err, user){
          if (err) return utils.validationError(res, err);
          let token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 60*5 });
          res.json({ token: token, user: user});
        });
      }
    });
  }
};
