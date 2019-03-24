const config = require('../common/config');
const util = require('../common/util');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
const targetPath = process.cwd() + config.image_store + '/original/';
fs.ensureDirSync(targetPath);
const files = fs.readdirSync(targetPath).map(a => a.substr(0, a.length - 4));
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');

    tweetCollection.find({status: 2}).toArray(function (err, tweetList) {
        tweetList = tweetList.filter(q => (q.meta.image !== '' && q.status === 2))
        let tweetCount = tweetList.length;
        if (tweetCount !== 0) {
            tweetList.forEach((tweet) => {
                util.downloadFromURL(tweet.meta.image, targetPath + tweet.meta.slug + '.' + tweet.meta.extension).then(() => {
                    tweetCollection.updateOne({id: tweet.id}, {$set: {status: 3}}, function (err, res) {
                        tweetCount--;
                        console.log(tweetCount);
                        if (tweetCount === 0) {
                            process.exit(0);
                        }
                    });
                }).catch((a) => {
                    console.log('error', a);
                });
            });
        } else {
            console.log(tweetCount);
            process.exit(0);
        }
    });
});

