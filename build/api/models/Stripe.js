'use strict';

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const crypto = require('crypto');


var userSchema = new mongoose.Schema({
  description: {type: String},
  currency: {type: String},
  price: {type: Number}
});
