'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.json');
const config = require('./config/env/index');
const _ = require('lodash');
const async = require('async');
var stripe = require("stripe")(config.secrets.STRIPE_SECRET_KEY);
var auth = require('basic-auth');

const UserController = require('./build/api/controllers/UserController');
const StripeController = require('./build/api/controllers/StripeController');
const User = require('./build/api/models/User');
const Stripe = require('./build/api/models/Stripe');

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
    var credentials = auth(req)
    // res.send('<h1> Empty node server V1</h1>');

    if (!credentials || credentials.name !== 'benight' || credentials.pass !== 'eip') {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.end('Benight Stripe - Access denied')
    } else {
      res.end('Benight Stripe - Access granted')
    }
  });

  app.post('/user/new', UserController.create);
  app.post('/payment/tripe', function(req, res, next){
    console.log(req.body)
    stripe.tokens.create({
      card: {
        "number": req.body.card.number,
        "exp_month": req.body.card.exp_month,
        "exp_year": req.body.card.exp_year,
        "cvc": req.body.card.cvc
      }
    }, function(err, token) {
      stripe.charges.create({
        amount: req.body.price,
        currency: req.body.currency,
        source: token.id
      })
      .then(function(charges){
        var newPayment = {
          stripID: charges.id,
          balance_transaction: charges.balance_transaction,
          currency: charges.currency,
          price: charges.amount,
          status: charges.status,
          paid: charges.paid
        }
        Stripe.create(newPayment, function(err, _res){
          if (err){
            res.status(500).send(err);
          }
          res.status(200).send(_res);
        })

      })
      .catch(function(err){
        res.status(500).send(err.message);
      })
    });
  });

  return app;
}
