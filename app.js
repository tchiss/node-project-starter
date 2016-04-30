'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.json');
const _ = require('lodash');
const async = require('async');

const UserController = require('./build/api/controllers/UserController');
const User = require('./build/api/models/User');

module.exports = function(port){

  process.env.MONGOLAB_URI = dbConfig.MONGOLAB.uri;
  mongoose.connect(process.env.MONGOLAB_URI);
  mongoose.connection.on('error', function(){
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  });

  var app = express();

  app.set('port', port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function (req, res, next) {
  res.removeHeader("x-powered-by");
  next();
  });

  app.get('/', function(req, res){

    res.send('<h1> Empty node server V1</h1>');
  });

  app.post('/user/new', UserController.create);

  return app;
}
