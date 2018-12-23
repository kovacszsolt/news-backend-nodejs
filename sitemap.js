const config = require('./common/config');
const xmlbuilder = require('xmlbuilder');
//const feed = builder.create('feed', { encoding: 'utf-8' });

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const output = [];
    tweetCollection.find({'status': 3}).limit(3).toArray(function (err, tweetList) {
        tweetList.forEach((tweet) => {
            // console.log(tweet.createTime.getFullYear()+'-'+tweet.createTime.getMonth()+'-'+tweet.createTime.getDate());
            output.push({
                'url': {
                    'loc': config.sitemap_domain + tweet.slug,
                    'lastmod': tweet.createTime.getFullYear() + '-' + tweet.createTime.getMonth() + '-' + tweet.createTime.getDate(),
                    'priority': 0.8
                }
            });
        });
        //console.log(output);
        var root = xmlbuilder.create(output);
        console.log(root.end({pretty: true}));
    });
});