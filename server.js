// server.js
// where your node app starts

// init project
var express = require('express');
var app     = express();
var bodyParser = require('body-parser')

const DATA  = require('./data/podcasts.json');
const _     = require('underscore');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/data", function (request, response) {
  response.send(DATA);
});

app.post("/episodes", function (request, response) {

  let data  = request.body || {};
  let query = data.query   || {};

  
  response.send(data);
});

app.post("/test", function (request, response) {

  let data  = request.body || {};
  let query = data.query   || {};

  response.json({msg: "success"});
});

app.get("/test", function (request, response) {

  let data  = request.body || {};
  let query = data.query   || {};

  
  response.send({msg: "success"});
});


// listen for requests
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
