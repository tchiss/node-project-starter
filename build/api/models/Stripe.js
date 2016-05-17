'use strict';
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');


var stripeSchema = new mongoose.Schema({
  stripID: {type: String},
  balance_transaction: {type: String},
  currency: {type: String},
  price: {type: Number},
  status: {type: String},
  paid: {type: Boolean}
});

let Stripe = mongoose.model('User', stripeSchema);
module.exports = Stripe;
