const config = require('../common/config');
const meta = require('../common/meta');
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

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');

    TwitterClient.get('statuses/user_timeline', {
        screen_name: config.twitter_screen_name,
        count: config.read_count
    }, async function (error, tweets, response) {
        console.log('tweets count', tweets.length);
        tweets = tweets.filter(q => q.retweet_count === 0);
        const _tweetList = [];
        const _urls = [];
        Promise.all(tweets.map((tweet) => {
            const created_at = tweet.created_at.split(' ');
            const created_date = new Date(created_at[0] + ', ' + created_at[2] + ' ' + created_at[1] + ' ' + created_at[5] + ' ' + created_at[3] + ' GMT');
            const tags = util.getHastagsFromText(tweet.text);
            return meta.getMetaFromUrl(util.getUrlFromText(tweet.text), {
                created_at: created_date,
                tags: tags,
                status: -1
            });
        })).then((dataList) => {
            const urlAll = dataList.map(data => data.url);
            tweetCollection.find({url: {$in: urlAll}}).toArray(function (err, tweetList) {
                const urlDatabase = tweetList.map(r => r.url);
                let newUrls = Array.from(new Set(
                    [...new Set(urlAll)].filter(x => !new Set(urlDatabase).has(x))));
                console.log('all urls', dataList.length);
                console.log('new urls', newUrls.length);
                newUrls.forEach((newUrl) => {
                    dataList.find(d => d.url === newUrl).status = 0;
                });
                const newTweets = dataList.filter(d => d.status === 0);
                if (newTweets.length === 0) {
                    process.exit(0);
                } else {
                    tweetCollection.insertMany(
                        newTweets
                        , function (err, result) {
                            if (err === null) {
                                console.log(result.insertedIds);
                                process.exit(0);
                            } else {
                                console.log(err);
                                process.exit(0);
                            }
                        });
                }
            });
        }).catch((e) => {
            console.log(e);
            process.exit(0);
        })
    });
});