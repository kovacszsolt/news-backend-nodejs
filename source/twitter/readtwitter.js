const config = require('../common/config');
const TwitterAPI = require('twitter');
const twitter = require('./tweet/private');
const category = require('./category/private');
const twittertContent = require('./content/private');
const util = require('../common/util');
var rp = require('request-promise');
const cheerio = require('cheerio');


var lodash = require('lodash');
const client = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

const params = {screen_name: config.twitter_screen_name};
client.get('statuses/user_timeline', params, async function (error, tweets, response) {
    if (!error) {
        let _categories = [];
        // tweets hashtags to array and generate uniq
        tweets.map((tweet) => {
            if (!tweet.retweeted) {
                _categories.push(...util.getHastagsFromText(tweet.text));
            }
        });
        _categories = lodash.uniq(_categories);

        let tweetCount = tweets.length;
        // get tags from database, if not find , store
        category.storeArrayCategory(_categories).then((storeAllCategoryResult) => {
            tweets.map((tweet) => {
                StoreTweet(tweet, storeAllCategoryResult).then((ok) => {
                    tweetCount--;
                    console.log(tweetCount);
                    if (tweetCount === 1) {
                        process.exit(0);
                    }
                }).catch((storeTweetError) => {
                    util.exit(storeTweetError);
                });
            });
        }).catch((storeAllCategoryError) => {
            util.exit(storeAllCategoryError);
        });
    }
});

const StoreTweet = (tweet, allCategory) => {
    return new Promise((resolve, reject) => {
        twitter.findTwitterId(tweet.id).then((result) => {
            if (result.length === 0) {
                const url = util.getUrlFromText(tweet.text);
                const tags = util.getHastagsFromText(tweet.text);
                const categoryIds = allCategory.filter(category => tags.includes(category.title)).map((categoryResult) => {
                    return categoryResult._id;
                });
                if (url !== '') {
                    util.getMetaFromURL(url).then((metaResult) => {
                        twittertContent.add(metaResult.title, metaResult.url, metaResult.description, metaResult.image).then((contentResult) => {
                            twitter.add(tweet.id, tweet.text, metaResult.title, url, tweet.created_at, categoryIds, contentResult._id).then((addResult) => {
                                resolve(addResult);
                            }).catch((addError) => {
                                reject(addError);
                            });
                        });
                    }).catch((metaError) => {
                        reject(metaError);
                    });
                }
            } else {
                resolve(result);
            }
        });
    });
}
