const config = require('../common/config');
const util = require('../common/util');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
const targetPath = process.cwd() + config.image_store + '/original/';
fs.ensureDirSync(targetPath);
const files = fs.readdirSync(targetPath).map(a => a.substr(0, a.length - 4));
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');

    tweetCollection.find().toArray(function (err, tweetList) {
        let tweetCount = tweetList.length;
        slugList = tweetList.map(tweet => tweet.slug);
        const newSlug = util.arrayDiff(slugList, files);
        console.log('tweetCount', tweetCount);
        console.log('newSlug', newSlug.length);
        tweetCollection.find({slug: {$in: newSlug}}).toArray(function (err, newTweetList) {
                Promise.all(
                    newTweetList.map(
                        newTweet =>
                            util.downloadFromURL(newTweet.image, targetPath + newTweet.slug + '.' + newTweet.extension)
                    )
                ).then((a) => {
                    mongoClient.close();
                })
            }
        );
    });
});

