const fs = require('fs-extra');
const config = require('../common/config');
const image = require('../common/image');
const imageConfig = config.image_sizes.find(imageconfig => imageconfig.name === 'size1');
let tweetCount = 0;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    tweetCollection.find({'status': 0}).toArray(function (err, tweetList) {
        const categoryList = [];
        tweetList.forEach((tweet) => {
            tweet.tags.forEach((tag) => {
                if (categoryList.find(a => a === tag) === undefined) {
                    categoryList.push(tag);
                }
            });
        });
        console.log('categoryCount', categoryList.length);
        const targetPath = process.cwd() + config.image_store + '/tag/';
        fs.ensureDirSync(targetPath);
        let categoryListNumber = categoryList.length;
        categoryList.forEach((category) => {
            image.createImageWithText(targetPath + category + '.jpg', imageConfig.width, imageConfig.height, imageConfig.backgroundcolor, category).then((imageResult) => {
                categoryListNumber--;
                console.log(categoryListNumber, category);
                if (categoryListNumber === 0) {
                    process.exit(0);
                }
            }).catch((err) => {
                console.log('err', err);
            });
        });
    });
});


