'use strict';

var stripe = require("stripe")(
  "sk_test_gBZlDiTaH3bX2v8YRbjPgpFz"
);

var User = require('../models/Stripe');
var config = require('../../../config/env');
var utils = require('./../../utils');


module.exports = {
  payment: function(req, res, next){
    console.log(req.body);
  }
}
