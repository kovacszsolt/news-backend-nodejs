const config = require('../common/config');
const util = require('../common/util');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
fs.removeSync(process.cwd() + config.image_store);
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    tweetCollection.drop(function (err, delOK) {
        mongoClient.close();
        process.exit(0);
    });
});