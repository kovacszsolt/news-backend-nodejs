const lodash = require('lodash');
const fs = require('fs-extra');
const config = require('../common/config');
const TwitterAPI = require('twitter');

const utilFunctions = require('../common/util');
const utilImageFunctions = require('../common/image');

const categoryFunctions = require('./category/private');
const tweetFunctions = require('./tweet/private');

const client = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

const params = {screen_name: config.twitter_screen_name, count: 199}

const __sizes = [
    {title: 'size1', width: 614},
    {title: 'size2', width: 760}
];

/**
 * START TWITTER READING
 */
console.log(config.twitter_excepotion[0]);
console.log(config.twitter_excepotion);
client.get('statuses/user_timeline', params, async function (error, tweets, response) {

    if (!error) {
        tweets = tweets.filter(q => q.retweet_count === 0);
        tweets = tweets.filter(q => !config.twitter_excepotion.includes(q.id.toString()));
        console.log('tweetsCount', tweets.length);
        categoryFunctions.storeArrayCategory(categoryNames(tweets)).then((storeArrayCategoryResult) => {
            Promise.all(tweets.map((tweetsResult) => {
                return getTweet(tweetsResult);
            })).then((PromiseAllResult) => {
                Promise.all(
                    getNewTweet(PromiseAllResult).map((mapResult) => {
                        return getTweetMeta(mapResult);
                    })
                ).then((tweetData) => {
                    if (tweetData.error) {
                        console.log('!+++++++++++++++++++++++');
                        console.log(tweetData);
                        process.exit(-1);
                    }
                    console.log('tweetDataLength', tweetData.length);
                    if (tweetData.length === 0) {
                        process.exit(0);
                    }
                    Promise.all(
                        tweetData.map((tweet) => {
                            return storeTweet(tweet);
                        })
                    ).then((tweetObjects) => {
                        let tweetCount = tweetObjects.length;
                        tweetObjects.forEach((tweetObject) => {
                            saveImages(tweetObject).then((imageIds) => {
                                tweetCount--;
                                console.log(tweetCount);
                                if (tweetCount === 0) {
                                    process.exit(0);
                                }
                            });
                        });
                    }).catch((tweetDataError) => {
                        console.log(tweetDataError);
                        process.exit(-1);
                    });
                }).catch((getNewTweetError) => {
                    console.log('getNewTweetError', getNewTweetError);
                    process.exit(-1);
                });

            }).catch((tweetsResultError) => {
                console.log('tweetsResultError', tweetsResultError);
                process.exit(-1);
            });
        }).catch((storeArrayCategoryError) => {
            console.log(storeArrayCategoryError);
            process.exit(-1);
        });
    }
});

const saveImages = (tweetObject) => {
    const original_file = config.image_store + '/original/' + tweetObject._id + '.' + tweetObject.imageextension;
    return utilFunctions.downloadFromURL(tweetObject.imageurl, original_file).then((downloadFromURLResult) => {
        const fileIds = [];
        __sizes.forEach((size) => {
            utilImageFunctions.resize(original_file, config.image_store + '/' + size.title + '/' + tweetObject._id + '.' + tweetObject.imageextension, size.width).then((resizeResopnse) => {
            }).catch((resizeError) => {
                console.log(resizeError);
                console.log('-------------------');
                console.log(tweetObject);
                process.exit(-1);
            });
        });
    }).catch((downloadFromURLError) => {
        console.log('downloadFromURL.error');
        console.log(tweetObject);
        //console.log(tweetObject.imageurl);
        console.log('-------------------');
    });
}

const storeTweet = (tweet) => {
    return Promise.all(getCategoryObjects(utilFunctions.getHastagsFromText(tweet.tweet.text))).then((data) => {
        const catids = data.map((categoryObject) => {
            return categoryObject[0]._id;
        });
        return tweetFunctions.add(tweet.tweet.id, tweet.tweet.text, tweet.meta.title, tweet.meta.url, tweet.created_at, catids, tweet.meta.description, tweet.meta.image).then((tweetObject) => {
            return tweetObject;
        })
    });
}

const getCategoryObjects = (categories) => {
    return categories.map((mapResult) => {
        return categoryFunctions.findSlug(mapResult).then((findSlugResult) => {
            return findSlugResult;
        });
    })
}

const categoryNames = (tweets) => {
    let _categories = [];
    tweets.forEach((tweet) => {
        if (!tweet.retweeted) {
            _categories.push(...utilFunctions.getHastagsFromText(tweet.text));
        }
    });
    _categories = lodash.uniq(_categories);
    return _categories;
}

const getNewTweet = (tweets) => {
    return tweets.filter(filterResult => (filterResult.result === null));
}

const getTweetMeta = (tweet) => {
    return utilFunctions.getMetaFromURL(utilFunctions.getUrlFromText(tweet.origonal.text)).then((meta) => {
        return {
            tweet: tweet['origonal'], meta: meta
        };
    }).catch((error) => {
        console.log((tweet));
        console.log('------------------------------------------------');
        console.log(error);
        process.exit(-1);
    });
}

const getTweet = (tweet) => {
    return tweetFunctions.findTwitterId(tweet.id).then((findTwitterIdResult) => {
        return {result: (findTwitterIdResult.length === 0) ? null : findTwitterIdResult[0], origonal: tweet}
    });
}