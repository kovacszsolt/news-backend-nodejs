console.log(new Date().getTime().toString());
const config = require('../common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const setttingsCollection = db.collection('setttings');
    setttingsCollection.find({'key': 'update'}).toArray(function (err, docs) {
        if (docs.length === 0) {
            setttingsCollection.insertMany([
                {key: 'update', value: new Date().getTime().toString()}
            ], function (insertErr, result) {
                console.log(insertErr);
                process.exit(0);
            });
        } else {
            setttingsCollection.updateOne(docs[0], {$set: {value: new Date().getTime().toString()}}, function (updateErr, result) {
                console.log(updateErr);
                process.exit(0);
            });
        }
    });

});
