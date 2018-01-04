var abspath  = __dirname.split();
var HOME     = abspath[0];
var DATAPATH = HOME+"/data/podcasts.json";

require(HOME+"/tools/StringHelpers.js");

let {WriteJSON} = require(HOME+"/tools/tools.js");

const uuid    = require('uuid/v4');
const Promise = require('promise');
const _       = require('underscore');
const moment  = require('moment');

const testdata = require('./lib/random.test.names').data;

//helper methods
function randomLoremObject() {
    let index = randomInt(0, testdata.length - 1)
    return testdata[index];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool() {
    return Math.random() >= 0.5;
}

//script methods
function writeData(data) {
    return WriteJSON(DATAPATH, data, true);
}

// SeriesUserInfo
// {
//     objectType: "SERIES_USERINFO",
//     seriesID: <String>,
//     userID: <String>,
//     subscribed: <Bool>
// }
function generateSeriesUserInfo(seriesId) {

   return {
        objectType: "SERIES_USERINFO",
        seriesID: seriesId,
        userID: uuid(),
        subscribed: randomBool()
    }
}

// Series
// {
//     objectType: "SERIES",
//     title: <String>,
//     id  : <String>,
//     lastUpdated: <UTC TimeStamp>,
//     description: <String>,
//     image: <String.URL>,
//     userInfo: <JSON.SERIES_USERINFO>  
// }
function generateSeriesInstance() {

    let seriesId = uuid()

    return {
        objectType: "SERIES",
        title: randomLoremObject().SeriesName,
        id: seriesId,
        lastUpdated: randomLoremObject().episodeDate,
        description: randomLoremObject().EpisodeDescription,
        image: "http://lorempixel.com/150/150/",
        userInfo: generateSeriesUserInfo(seriesId)
    }
}

// EpisodeUserInfo
// {
//     objectType: "EPISODE_USERINFO",
//     episodeID: <String>,
//     userID: <String>,
//     played: <Bool>,
//     resume: <Int> 
//     //time in seconds where we should resume play. Defaults to 0    
//    }
function generateEpisodeUserInfo(episode, userId) {
    return {
        objectType: "EPISODE_USERINFO",
        episodeID: episode.id,
        userID: userId,
        played: randomBool(),
        resume: randomInt(0, episode.duration)   
    }
}

// Episode
// {
//     objectType: "EPISODE",
//     seriesId: <String>,
//     id : <String>,
//     duration: <Interval>,
//     title: <String>,
//     tags: [<String>],
//     publishDate: <UTC TimeStamp>,
//     description: <String>,
//     imageURL: <String.URL>,
//     streamingURL: <String.URL>,
//     userInfo: <JSON.EPISODE_USERINFO>
// }
function generateEpisodeInstance(series) {

    var episode = {
        objectType: "EPISODE",
        seriesId: series.id,
        id: uuid(),
        tags: randomBool() ? ["news"] : [],
        duration: randomInt(300, 7200),
        title: randomLoremObject().EpisodeTitle,
        publishDate: randomLoremObject().episodeDate,
        description: randomLoremObject().EpisodeDescription,
        imageURL: "http://lorempixel.com/150/150/",
        streamingURL: "https://16533.mc.tritondigital.com/NPR_510313/media-session/633f5e15-aea8-456a-a573-0cbb40e96b1c/anon.npr-mp3/npr/hibt/2017/12/20171221_hibt_clif.mp3",
    }

    episode.userInfo = generateEpisodeUserInfo(episode, uuid());

    return episode
}

function generateEpisodesForSeries(series) {

    let episodeCount = randomInt(2, 35);
    var episodes = [];
    for (var i = 0; i < episodeCount; i++) {
        episodes.push(generateEpisodeInstance(series))
    }
    return episodes;
}



function generateSeries() {

    var series = [];

    let seriesCount = randomInt(15, 40)

    for (var i = 0; i < seriesCount; i++) {
        series.push(generateSeriesInstance())
    }

    return Promise.resolve(series);
}

// Gallery 
// {
//     objectType: "GALLERY",
//     id: <String>,
//     series: [<JSON.SERIES>]
// }
function generateGallery(series) {

    let firstIndex = randomInt(0, series.length - 1);
    let lastIndex   = randomInt(0, series.length - 1);

    var seriesList = [];

    if (firstIndex < lastIndex) {
        seriesList = series.slice(firstIndex, lastIndex);
    } else {
        seriesList = series.slice(lastIndex, firstIndex);
    }

    return {
        objectType: "GALLERY",
        id: uuid(),
        series: seriesList
    }
}

function generateData() {
    return generateSeries()
    .then(function(series) {

        var data = {
            series: series
        }

        //note: these are all episodes for all series
        //They're seperated to make the test data more closely
        //resemble the way we will actually retrieve episodes & series
        //@ allEpidoes is [[<EPIDODES>]]
        let episodes = _.map(series, function(s) {
            return generateEpisodesForSeries(s);
        })
        data.episodes = _.flatten(episodes);
        return Promise.resolve(data);
    })
    .then(function(data) {

        let galleryCount = randomInt(5, 20);
        var galleries    = [];

        for (var i = 0; i < galleryCount; i++) {
            galleries.push(generateGallery(data.series))
        }

        data.galleries = galleries;

        return Promise.resolve(data);
    })
}

generateData()
.then(function(data){
    return writeData(data);
})
.then(function(){
    console.log("complete")
},
function(err){
    console.log("error: ", err);
})

