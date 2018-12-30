const config = require('../common/config');
const util = require('../common/util');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs-extra');
let tweetCount = 0;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const targetPath = process.cwd() + config.image_store + '/original/';
    fs.ensureDirSync(targetPath);
    tweetCollection.find({'status': 1}).toArray(function (err, tweetList) {
        tweetCount = tweetList.length;
        tweetList.forEach((tweet) => {
            const targetFile = targetPath + tweet._id + '.' + tweet.extension;
            downloadFromURL(tweetCollection, tweet, targetFile);
        });
    });
});

const downloadFromURL = (collection, tweet, target) => {
    let url = tweet.image;
    if (url !== undefined) {
        if (url.substring(0, 2) === '//') {
            url = 'http:' + url;
        }
    } else {
        url = '';
    }
    if (url.substring(0, 1) == '/') {
        resolve(false);
    }
    request(url, {encoding: 'binary'}, function (error, response, body) {
        if (error === null) {
            fs.writeFile(target, body, 'binary', function (err) {
                if (err === null) {
                    collection.updateOne(tweet, {$set: {status: 2}}, function (updateErr, result) {
                        if (updateErr === null) {
                            tweetCount--;
                            console.log(tweetCount);
                            if (tweetCount === 0) {
                                process.exit(0);
                            }
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log('write error', err);
                }
            });
        } else {
            console.log('request error', error);
        }
    });
}

