'use strict';

const express = require('express');
const kasua = require('./app');

var app = express();
var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV || 'development';

app.use(kasua(port));
app.listen(port, function(){
  console.log('Node server is running in ' + environment + ' mode via ' + port + ' port');
});