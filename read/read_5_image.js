const config = require('../common/config');
const util = require('../common/util');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const targetPath = process.cwd() + config.image_store + '/original/';
    fs.ensureDirSync(targetPath);
    tweetCollection.find().toArray(function (err, tweetList) {
        let tweetCount = tweetList.length;
        tweetList.forEach((tweet) => {
            const targetFile = targetPath + tweet.slug + '.' + tweet.extension;
            if (!fs.existsSync(targetFile)) {
                util.downloadFromURL(tweet.image, targetFile).then((a) => {
                    tweetCount--;
                    console.log('read_5_image', tweetCount, 'DOWNLOAD', targetFile);
                    if (tweetCount === 0) {
                        process.exit(0);
                    }
                }).catch((e) => {
                    tweetCount--;
                    console.log('read_5_image', tweetCount, 'ERROR', targetFile);
                });
            } else {
                tweetCount--;
                console.log('read_5_image', tweetCount, 'SKIP', targetFile);
                if (tweetCount === 0) {
                    process.exit(0);
                }
            }
        });
    });
});

