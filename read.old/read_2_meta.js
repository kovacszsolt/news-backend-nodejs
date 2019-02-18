const config = require('../common/config');
const util = require('../common/util');
const request = require('request');
const cheerio = require('cheerio');
const slug = require('slug');
let tweetCount = 0;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    tweetCollection.find({'status': 0}).toArray(function (err, tweetList) {
        tweetCount = tweetList.length;
        tweetList.forEach((tweet) => {
            getMeta(tweetCollection, tweet, tweet.shorturl);
        });
    });
});
let _metaForError;
const getMeta = (collection, tweet, url) => {
    request(url, function (error, response, body) {
        try {
            if (error === null) {
                const _cheerio = cheerio.load(body);
                const _meta = {};
                _meta.title = _cheerio('meta[property="og:title"]').attr('content');
                _meta.url = _cheerio('meta[property="og:url"]').attr('content');
                _meta.description = _cheerio('meta[property="og:description"]').attr('content');
                _meta.image = _cheerio('meta[property="og:image"]').attr('content');
                if (_meta.image == undefined) {
                    _meta.image = _cheerio('meta[name="twitter:image"]').attr('content');
                }
                _meta.slug = slug(_meta.title).toLowerCase();
                _metaForError = _meta;
                if (_meta.image.substring(0, 4) !== 'http') {
                    if (_meta.image.substring(0, 2) === '//') {
                        _meta.image = 'http://' + _meta.image.substr(2);
                    } else {
                        _meta.image = _meta.url.split('/').slice(0, 3).join('/') + _meta.image;
                    }
                }
                _meta.extension = util.getFileExtension(_meta.image);

                _meta.status = 1;
                collection.updateOne(tweet, {$set: _meta}, function (err, result) {
                    if (err === null) {
                        tweetCount--;
                        console.log('read_2_meta', tweetCount);
                        if (tweetCount === 0) {
                            process.exit(0);
                        }
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log('url', url);
                console.log('error', error);
                process.exit(-1);
            }
        } catch (ee) {
            console.log(tweet);
            console.log(_metaForError);
            console.log('ee', ee);
            process.exit(-1);
        }
    });
}
