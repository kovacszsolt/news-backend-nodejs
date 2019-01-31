const config = require('../common/config');
console.log(config);
const util = require('../common/util');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
let tweet_count = 0;
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const userCollection = db.collection('user');
    const userData = config.default_user;
    userCollection.insertOne(userData, (error, response) => {
        // console.log('error', error);
        //console.log('response', response);
    });
});