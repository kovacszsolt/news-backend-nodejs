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
        tweets = tweets.filter(q => q.retweet_count === 0);
        tweet_count = tweets.length;
        console.log(tweet_count);
        const _tweetList = [];
        const _urls = [];
        Promise.all(tweets.map((tweet) => {
            const created_at = tweet.created_at.split(' ');
            const created_date = new Date(created_at[0] + ', ' + created_at[2] + ' ' + created_at[1] + ' ' + created_at[5] + ' ' + created_at[3] + ' GMT');
            return meta.getMetaFromUrl(util.getUrlFromText(tweet.text), created_date);
        })).then((dataList) => {
            const urlAll = dataList.map(data => data.url);
            tweetCollection.find({url: {$in: urlAll}}).toArray(function (err, tweetList) {
                const urlDatabase = tweetList.map(r => r.url);
                let newUrls = Array.from(new Set(
                    [...new Set(urlAll)].filter(x => !new Set(urlDatabase).has(x))));
                console.log(newUrls);

            });

            //const urls = dataList.map(data => data.url);
            /*
            tweetCollection.insertMany(
                dataList
                , function (err, result) {
                    if (err === null) {
                        console.log(result);
                        process.exit(0);
                    } else {
                        console.log(err);
                        process.exit(0);
                    }
                });
*/
            /*
            getNew(r).then((newUrls) => {
                console.log(newUrls);
                process.exit(0);
            });
*/
        }).catch((e) => {
            console.log(e);
            process.exit(0);
        })
        /*
        tweets.forEach((tweet) => {
            console.log(tweet);
            meta.getMetaFromUrl(util.getUrlFromText(tweet.text)).then((metaData) => {
                metaData.created_at = tweet.created_at;
                tweet_count--;
                console.log(tweet_count);
                _urls.push(metaData);

                if (tweet_count === 0) {
                    getNew(_urls).then((newUrls) => {
                        console.log(newUrls);
                        tweetCollection.insertMany(
                            newUrls
                            , function (err, result) {
                                if (err === null) {
                                    console.log(result);
                                    process.exit(0);
                                } else {
                                    console.log(err);
                                    process.exit(0);
                                }
                            });
                    }).catch((e)=>{
                        console.log(e);
                        process.exit(0);
                    });
                }
            }).catch((metaError) => {
                console.log(metaError);
                process.exit();
            });
        });
        */
    });

    getNew = (urls) => {
        return new Promise((resolve, reject) => {
            const urlTmp = urls.map(u => u.url);
            tweetCollection.find({url: {$in: urlTmp}}).toArray(function (err, tweetList) {
                const __url = [];
                tweetList.forEach((tweet) => {
                    __url.push(tweet.url);
                });
                const newUrl = [];
                urls.forEach((url) => {
                    if (__url.includes(url.url)) {
                        newUrl.push(url);
                    }
                });
                resolve(newUrl);
            });
        });
    }
});