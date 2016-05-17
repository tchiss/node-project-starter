'use strict';

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const crypto = require('crypto');


var userSchema = new mongoose.Schema({
  stripID: {type: String},
  balance_transaction: {type: String},
  currency: {type: String},
  price: {type: Number},
  status: {type: String},
  paid: {type: Boolean}
});
