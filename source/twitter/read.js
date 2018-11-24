const lodash = require('lodash');

const config = require('../common/config');
const TwitterAPI = require('twitter');

const utilFunctions = require('../common/util');
const utilImageFunctions = require('../common/image');

const categoryFunctions = require('./category/private');
const tweetFunctions = require('./tweet/private');
const imageFunctions = require('./image/private');

const client = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

const params = {screen_name: config.twitter_screen_name, count: 3}

const __sizes = [
    {title: 'size1', width: 614},
    {title: 'size2', width: 760}
];

const PUBLIC = './_public/images';

/**
 * START TWITTER READING
 */

client.get('statuses/user_timeline', params, async function (error, tweets, response) {

    if (!error) {
        let tweetCount = tweets.length;

        categoryFunctions.storeArrayCategory(categoryNames(tweets)).then((storeArrayCategoryResult) => {
            Promise.all(tweets.map((tweetsResult) => {
                return getTweet(tweetsResult);
            })).then((PromiseAllResult) => {
                Promise.all(
                    getNewTweet(PromiseAllResult).map((mapResult) => {
                        return getTweetMeta(mapResult);
                    })
                ).then((tweetData) => {
                    Promise.all(
                        tweetData.map((tweet) => {
                            return storeTweet(tweet);
                        })
                    ).then((tweetObjects) => {
                        tweetObjects.forEach((tweetObject) => {
                            saveImages(tweetObject);
                        });
                    });
                });

            });
        });
    }
});


const saveImages = (tweetObject) => {
    __sizes.forEach((size) => {
        const image_record = imageFunctions.add(tweetObject._id, tweetObject.title, size.title);
        console.log('image_record', image_record);
        console.log(tweetObject.imageurl);
        utilImageFunctions.resize(tweetObject.imageurl, PUBLIC + '/' + image_record._id + '.jpg', size.width).then((tmp) => {
            console.log('tmp', tmp);
        }).catch((ccc) => {
            console.log('cath', ccc);
        });

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
        return {tweet: tweet['origonal'], meta: meta};
    });
}

const getTweet = (tweet) => {
    return tweetFunctions.findTwitterId(tweet.id).then((findTwitterIdResult) => {
        return {result: (findTwitterIdResult.length === 0) ? null : findTwitterIdResult[0], origonal: tweet}
    });
}