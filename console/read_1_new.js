const util = require('../common/util');

const config = require('../common/config');
const TwitterAPI = require('twitter');
const TwitterClient = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');

    TwitterClient.get('statuses/user_timeline', {
        screen_name: config.twitter_screen_name,
        count: config.read_count
    }, async function (error, tweets, response) {
        const records = [];
        tweets = tweets.filter(q => q.retweet_count === 0);
        const tweetids = tweets.map(tweet => tweet.id);
        tweetCollection.find().toArray(function (err, tweetList) {
            const databaseids = tweetList.map(record => record.id);
            const newIds = util.arrayDiff(tweetids, databaseids);
            const newTweets = tweets.filter(tweet => newIds.includes(tweet.id));
            if (newTweets.length !== 0) {
                newTweets.forEach((record) => {
                    records.push({
                        id: record.id,
                        text: record.text,
                        url_short: util.getUrlFromText(record.text),
                        tags: util.getHastagsFromText(record.text),
                        created_at: record.created_at,
                        status: 1
                    });
                });
                tweetCollection.insertMany(
                    records
                    , function (err, result) {
                        if (err === null) {
                            console.log(result.insertedIds);
                            process.exit(0);
                        } else {
                            console.log(err);
                            process.exit(0);
                        }
                    });
            } else {
                console.log(newTweets);
                process.exit(0);
            }

        });

    });
});
