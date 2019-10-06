const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const webClass = require('./web/web');
const ssrClass = require('./web/ssr');
const swaggerClass = require('./swagger/web');
const appServer = express();
const ssrServer = express();

appServer.set('port', config.port);
ssrServer.set('port', config.ssr_port);

const swagger = new swaggerClass(express, bodyParser, config.swagger);
swagger.start();

appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({extended: true}));
appServer.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
ssrServer.use(bodyParser.json());
ssrServer.use(bodyParser.urlencoded({extended: true}));
ssrServer.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


appServer.get('/', function (req, res) {
    res.send({data: 'hello backend world'});
});

ssrServer.get('/', function (req, res) {
    res.send({data: 'hello ssr world'});
});

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useUnifiedTopology: true, useNewUrlParser: true});
mongoClient.connect(function (err, client) {

    const db = client.db(config.mongo_database);


    const tweetCollection = db.collection('tweet');
    const statusCollection = db.collection('status');
    const web = new webClass(tweetCollection, statusCollection, config);
    const ssr = new ssrClass(tweetCollection, config);
    appServer.get('/list/', function (req, res) {
        web.list().then((tweetList) => {
            res.json(tweetList);
        });
    });

    appServer.get('/image/tag/:tag.jpg', function (req, res) {
        web.findTagImage(req.params.tag).then((requestFileName) => {
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        });
    });

    appServer.get('/update', function (req, res) {
        const fileName = '/_public/update.json';
        res.sendFile(fileName, {root: './'}, function (err) {
        });
    });

    appServer.get('/search/:text', function (req, res) {
        web.search(req.params.text).then((tweetList) => {
            res.json(tweetList);
        });
    });
    appServer.get('/position/gt/:position', function (req, res) {
        web.positionListGreaterThan(req.params.position).then((tweetList) => {
            res.json(tweetList);
        });
    });
    appServer.get('/position/list', function (req, res) {
        web.positionList().then((tweetList) => {
            res.json(tweetList);
        });
    });

    appServer.get('/position/:number', function (req, res) {
        web.position(req.params.number).then((tweetList) => {
            res.json(tweetList);
        });
    });

    appServer.get('/image/:size/:tweetslug.:extension', function (req, res) {

        web.findTweetImage(req.params.size, req.params.tweetslug, req.params.extension).then((requestFileName) => {
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        });
    });

    ssrServer.get('/sitemap.xml', function (req, res) {
        ssr.sitemap().then((sitemap) => {
            res.send(sitemap.end({pretty: true}));
        });
    });

    ssrServer.get('/tag/:tagslug', function (req, res) {

        ssr.tag(req.params.tagslug).then((result) => {
            res.send(result);
        });
    });

    ssrServer.get('/:tweetslug', function (req, res) {
        ssr.tweet(req.params.tweetslug).then((result) => {
            res.send(result);
        });
    });

    ssrServer.get('/', function (req, res) {
        ssr.root().then((result) => {
            res.send(result);
        });
    });

    appServer.listen(appServer.get('port'), function () {
        console.log('running on port', appServer.get('port'))
    });

    ssrServer.listen(ssrServer.get('port'), function () {
        console.log('running on port', ssrServer.get('port'))
    });

    appServer.get('/list/:page/:pagesize', function (req, res) {
        web.listPage(req.params.page, req.params.pagesize).then((tweetList) => {
            res.json(tweetList);
        });
    });

});
