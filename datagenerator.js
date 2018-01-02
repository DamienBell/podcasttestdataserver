
const uuid       = require('uuid/v1');
import _         from 'underscore';
import moment    from 'moment';
import data      from './random.test.names';

function randomBool() {
    return Math.random() >= 0.5;
}

export default class DataGenerator {

    constructor() {
        this.userId   = uuid()
        this.series   = [];
        this.episodes = [];
    }
    generateSeries() {

        let seriesId = uuid()

        var userinfo = {
            objectType: "SERIES_USERINFO",
            seriesId: seriesId,
            subcribed: randomBool(),


        }
    }

    generateEpisodes(series, index) {

    }


}
// SeriesUserInfo
// {
//     objectType: "SERIES_USERINFO",
//     seriesID: <String>,
//     userID: <String>,
//     subcribed: <Bool>
// }

// EpisodeUserInfo
// {
//     objectType: "EPISODE_USERINFO",
//     episodeID: <String>,
//     userID: <String>,
//     played: <Bool>,
//     resume: <Int> 
//     //time in seconds where we should resume play. Defaults to 0
    
//    }

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

// Episode
// {
//     objectType: "EPISODE",
//     seriesId: <String>,
//     id : <String>,
//     duration: <Interval>,
//     title: <String>,
//     publishDate: <UTC TimeStamp>,
//     description: <String>,
//     imageURL: <String.URL>,
//     streamingURL: <String.URL>,
//     userInfo: <JSON.EPISODE_USERINFO>
// }

// Gallery 
// {
//     objectType: "GALLERY",
//     id: <String>,
//     series: [<JSON.SERIES>]
// }

// User 
// {
//     objectType: "USER",
//     id: <String>,
//     email: <String>
//     ...whatever other properies come with this
// }