const image = require('./image/private');
const _tweet = require('./tweet/private');
const util = require('../common/util');
const _image = require('../common/image');
const fs = require('fs-extra');
const PUBLIC = './_public/images';

const __sizes = [
    {title: 'size1', width: 614},
    {title: 'size2', width: 760}
];

const resize = (file, size, tweet_id) => {
    return new Promise((resolve, reject) => {
        const image_record = image.add(tweet_id, file, size.title);
        _image.resize(file, PUBLIC + '/' + image_record._id + '.jpg', size.width).then((resizeResult) => {
            resolve(image_record._id);
        }).catch((resizeError) => {
            reject(resizeError);
        });
    });

}

fs.mkdirsSync(PUBLIC + '/original');
_tweet.find({twitter_image: []}).then((tweetListResult) => {
        tweetListResult.map((tweet) => {
            console.log('___id', tweet._id);
            if (tweet.twitter_content === undefined) {
                console.log('tweet.twitter_content===undefined', tweet._id);
                //   process.exit(0);
            } else {
                const imageurl = tweet.twitter_content.imageurl;
                if (imageurl !== undefined) {
                    const fileOriginal = PUBLIC + '/original/' + tweet._id + '.jpg';
                    util.downloadFromURL(imageurl, fileOriginal).then((downloadFromURLResult) => {
                        if (downloadFromURLResult) {
                            Promise.all(
                                __sizes.map(size => resize(fileOriginal, size, tweet._id))
                            ).then((result) => {
                                _tweet.addImages(tweet._id, result);
                                console.log(result)
                            }).catch((error) => {
                                console.log('tweet._id', tweet._id);
                                console.log(error);
                              //  process.exit(-1);
                            })
                        }
                    });
                } else {
                    console.log('imageurl === undefined', tweet._id);
                }
            }
        });
    }
);
