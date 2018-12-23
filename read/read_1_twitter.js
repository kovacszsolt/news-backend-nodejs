const config = require('../common/config');
const util = require('../common/util');
const TwitterAPI = require('twitter');
const TwitterClient = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
let tweet_count = 0;
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    TwitterClient.get('statuses/user_timeline', {
        screen_name: config.twitter_screen_name,
        count: config.read_count
    }, async function (error, tweets, response) {
        console.log(tweets[0].created_at.split(' '));
        tweets = tweets.filter(q => q.retweet_count === 0);
        tweets = tweets.filter(q => !config.twitter_excepotion.includes(q.id.toString()));
        tweet_count = tweets.length;
        const tweetCollection = db.collection('tweet');
        _tweetList = [];
        tweets.forEach((tweet) => {
            const created_at = tweet.created_at.split(' ');
            const created_date=new Date(created_at[0] + ', ' + created_at[2] + ' ' + created_at[1] + ' ' + created_at[5] + ' ' + created_at[3] + ' GMT');
            _tweetList.push({
                id: tweet.id_str,
                text: tweet.text,
                shorturl: util.getUrlFromText(tweet.text),
                tags: util.getHastagsFromText(tweet.text),
                createTime: created_date,
                status: 0
            });
            tweet_count--;
            console.log(tweet_count);
        });
        tweetCollection.insertMany(
            _tweetList
            , function (err, result) {
                if (err === null) {
                    process.exit(0);
                } else {
                    console.log(err);
                }

            });
    });
});

