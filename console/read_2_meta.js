const util = require('../common/util');
const meta = require('../common/meta');
const config = require('../common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    tweetCollection.find({status: 1}).toArray(function (err, tweetList) {
        let tweetCount = tweetList.length;
        let tweetError = 0;
        const tweetErrorList = [];
        tweetList.forEach((tweet) => {
            meta.getMetaFromUrl(tweet.url_short, []).then((data) => {
                tweetCollection.updateOne({id: tweet.id}, {$set: {status: 2, meta: data}}, function (err, res) {
                    tweetCount--;
                    console.log(tweetCount);
                    if (tweetCount === 0) {
                        console.log('tweetList.length', tweetList.length);
                        console.log('tweetError', tweetError);
                        console.log('tweetErrorList', tweetErrorList);
                        process.exit(0);
                    }
                });
            }).catch((e) => {
                tweetCount--;
                tweetErrorList.push(tweet);
                console.log(tweetCount);
                console.log(e);
                console.log(tweet);
                tweetError++;
                if (tweetCount === 0) {
                    console.log('tweetList.length', tweetList.length);
                    console.log('tweetList.error', tweetError);
                    process.exit(0);
                }
            });
        });
    });
});
