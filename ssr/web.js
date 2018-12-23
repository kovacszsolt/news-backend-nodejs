const config = require('../common/config');
const express = require('express');
const bodyParser = require('body-parser');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs-extra');

const app = express();

app.set('port', config.port_ssr);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.send({data: 'hello ssr world'});
});

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');

    app.get('/list/', function (req, res) {
        tweetCollection.find({'status': 3}).toArray(function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.get('/sitemap.xml', function (req, res) {
        const output = [];
        tweetCollection.find({'status': 3}).toArray(function (err, tweetList) {
            tweetList.forEach((tweet) => {
                output.push({
                    'url': {
                        'loc': config.sitemap_domain + tweet.slug,
                        'lastmod': tweet.createTime.getFullYear() + '-' + tweet.createTime.getMonth() + '-' + tweet.createTime.getDate(),
                        'priority': 0.8
                    }
                });
            });
            var root = xmlbuilder.create(output);
            res.send(root.end({pretty: true}));
        });
    });

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    })

});