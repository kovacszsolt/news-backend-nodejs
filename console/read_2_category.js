const fs = require('fs-extra');
const config = require('../common/config');
const image = require('../common/image');
const util = require('../common/util');
const imageConfig = config.image_sizes.find(imageconfig => imageconfig.name === 'size1');
let tweetCount = 0;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

const targetPath = process.cwd() + config.image_store + '/tag/';
fs.ensureDirSync(targetPath);
const files = fs.readdirSync(targetPath).map(a => a.substr(0, a.length - 4));


mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    tweetCollection.find().toArray(function (err, tweetList) {
        const categoryList = [];
        tweetList.map(a => a.tags).forEach((_a) => {
            _a.forEach((_b) => {
                categoryList.push(_b);
            })
        });
        const newCategory = util.arrayDiff(categoryList, files);
        Promise.all(
            newCategory.map(category =>
                image.createImageWithText(targetPath + category + '.jpg', imageConfig.width, imageConfig.height, imageConfig.backgroundcolor, category)
            )
        ).then((result) => {
            console.log('image count', result.length);
            mongoClient.close();
        });
    });
});


