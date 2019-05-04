const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const webClass = require('./web/web');
const ssrClass = require('./web/ssr');
const app = express();
const ssr = express();

app.set('port', config.port);
ssr.set('port', config.ssr_port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
ssr.use(bodyParser.json());
ssr.use(bodyParser.urlencoded({extended: true}));
ssr.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.send({data: 'hello backend world'});
});

ssr.get('/', function (req, res) {
    res.send({data: 'hello ssr world'});
});

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {

    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const web = new webClass(tweetCollection, config);
    const ssr = new ssrClass(tweetCollection, config);
    app.get('/list/', function (req, res) {
        web.list().then((tweetList) => {
            res.json(tweetList);
        });
    });

    app.get('/image/tag/:tag.jpg', function (req, res) {
        web.findTagImage(req.params.tag).then((requestFileName) => {
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        });
    });

    app.get('/update', function (req, res) {
        const fileName = '/_public/update.json';
        res.sendFile(fileName, {root: './'}, function (err) {
        });
    });

    app.get('/search/:text', function (req, res) {
        web.search(req.params.text).then((tweetList) => {
            res.json(tweetList);
        });
    });

    app.get('/image/:size/:tweetslug.:extension', function (req, res) {

        web.findTweetImage(req.params.size, req.params.tweetslug, req.params.extension).then((requestFileName) => {
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        });
    });


    ssr.get('/sitemap.xml', function (req, res) {
        ssr.sitemap().then((sitemap) => {
            res.send(sitemap.end({pretty: true}));
        });
    });

    ssr.get('/tag/:tagslug', function (req, res) {

        ssr.tag(req.params.tagslug).then((result) => {
            res.send(result);
        });
    });

    ssr.get('/:tweetslug', function (req, res) {
        ssr.tweet(req.params.tweetslug).then((result) => {
            res.send(result);
        });
    });

    ssr.get('/', function (req, res) {
        ssr.root().then((result) => {
            res.send(result);
        });
    });

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    });

    ssr.listen(ssr.get('port'), function () {
        console.log('running on port', ssr.get('port'))
    });

});
