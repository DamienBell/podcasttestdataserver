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


let RespondSuccess = function(response, data){
  return response.json({status: "success", results: data});
}

let RespondError = function(response, msg){
  return response.json({status: "failed", msg: msg});
}

let SeriesQuery = function(query) {

  let offset = query.offset || 0;

  let matches = _.filter(DATA.series, function(s, index) {

    if (query.id !== undefined) {
      if (s.id !== query.id) {
        return false
      }
    }

    if (query.subscribed !== undefined) {
      if (query.subscribed != s.userInfo.subscribed) {
        return false
      }
    }

    return true
  });

  return matches.slice(offset, offset + 20)
}

var EpisodeQuery = function(query) {

  let offset = query.offset || 0;
  let keys   = _.keys(query);

  var matches = _.filter(DATA.episodes, function(e) {

    var passed = true
    _.each(keys, function(key) {

      if (e[key] !== undefined && key !== "tags") {

        if (e[key] != query[key]) {
          passed = false
        }
      }

      let info = e.userInfo
      if (info[key] !== undefined && key !== "tags" ) {

        if (info[key] != query[key]) {
          passed = false
        }
      } 
    })

    return passed
  })

  if (query.tags !== undefined && query.tags.length) {
    matches = _.filter(matches, function(e) {

      var pass = true
      for (var i = 0; i < query.tags.length; i++ ) {
        var tag = query.tags[i];
        if (!_.contains(e.tags, tag)) {
          pass = false;
        }
      }
      return pass
    })
  }

  return matches.slice(offset, offset + 20)
}

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/data", function (request, response) {
  response.send(DATA);
});

// {
//   //optional: restrices query to episodes a user is subscribed to.
//   subcriber: <String.USER_ID>
  
//   //optional: restricts query to episodes with matching tags.
//   //an example of this may be ["news"]
//   tags: [<String>],
  
//   //optional: restricts query to `played` or `unplayed` depending on value. If left unset then there is no restriction by 'played' value.
//   played: <Bool>
  
//   //optional: Defines offset for pagination. If unset, then offset of 0 is assumed.
//   offset: <Int>
  
//   //optional: A string that can be matched against relevant episode meta data (tags, description, title, ect.)  
//   search: <String>
  
//   //optional: A seriesID restricting the results to episodes from a series.
//   series: <String>
  
//   //optional: Sorts returned episodes by release date. If not set then `DESC` (most to least recent is assumed).
//   sort: 'ASC' | 'DESC'
  
//   }

//search episodes according to a query object
app.post("/episodes", function (request, response) {

  let data   = request.body || {};
  let query  = data.query   || {};
  let offset = query.offset || 0;

  RespondSuccess(response, {
    offset: offset + 20,
    episodes: EpisodeQuery(query)
  });
});

app.post("/series", function (request, response) {

  let data   = request.body || {};
  let query  = data.query   || {};
  let offset = query.offset || 0;

  RespondSuccess(response, {
    offset: offset + 20,
    series: SeriesQuery(query)
  });
});

app.post("/test", function (request, response) {

  let data  = request.body || {};
  let query = data.query   || {};

  RespondSuccess(response, {msg: "howdy"})
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
