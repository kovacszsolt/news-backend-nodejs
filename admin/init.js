const config = require('../common/config');
const util = require('../common/util');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
let tweet_count = 0;
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const userCollection = db.collection('user');
    userCollection.find({email: config.default_user.email}).toArray(
        (err, result) => {
            if (result.length === 0) {
                userCollection.insertOne(config.default_user, (error, response) => {
                    console.log('add');
                    client.close();
                });
            } else {
                console.log('no add');
                client.close();
            }
        }
    );
});