const config = require('../common/config');
const TwitterAPI = require('twitter');
const twitter = require('./tweet/private');
const category = require('./category/private');
const twittertContent = require('./content/private');
const twitterImage = require('./image/private');
const util = require('../common/util');
const image = require('../common/image');
const cheerio = require('cheerio');
const sleep = require('sleep');
const sharp = require('sharp');
const fs = require('fs');
const slug = require('slug');

var lodash = require('lodash');
const client = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

const params = {screen_name: config.twitter_screen_name, count: 199}


/**
 * START TWITTER READING
 */

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
        let runCount = tweets.length;
        // get tags from database, if not find , store
        category.storeArrayCategory(_categories).then((storeAllCategoryResult) => {
            tweets.map((tweet) => {
                tweetCount--;
                StoreTweet(tweet, storeAllCategoryResult, tweetCount).then((ok) => {
                    runCount--;
                    console.log('runCount', runCount);
                    if (runCount === 1) {
                        process.exit(0);
                    }
                }).catch((storeTweetError) => {
                    console.log('storeTweetError');
                    util.exit(storeTweetError);
                });
            });
        }).catch((storeAllCategoryError) => {
            console.log('storeAllCategoryError');
            util.exit(storeAllCategoryError);
        });
    } else {
        console.log(error);
    }
});

const StoreTweet = (tweet, allCategory, postion) => {
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
                        //   console.log('getMetaFromURL - end');
                        twittertContent.add(metaResult.title, metaResult.url, metaResult.description, metaResult.image).then((contentResult) => {
                            twitter.add(tweet.id, tweet.text, metaResult.title, url, tweet.created_at, categoryIds, contentResult._id).then((addResult) => {
                                resolve(addResult);
                            }).catch((addError) => {
                                util.exit(addError);
                                reject(addError);
                            });

                            /*

                            */


                        });
                    }).catch((metaError) => {
                        console.log('metaError',url);
                        util.exit(metaError);
                        reject(metaError);
                    });
                }
            } else {
                resolve(result);
            }
        });
    });
}
