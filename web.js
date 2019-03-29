const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const handlebars = require('hbs');
const xmlbuilder = require('xmlbuilder');

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
    const settingsCollection = db.collection('setttings');

    app.get('/list/', function (req, res) {
        tweetCollection.find({status: 3}).toArray(function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.get('/image/tag/:tag.jpg', function (req, res) {
        const fileName = process.cwd() + config.image_store + '/tag/' + req.params.tag + '.jpg';
        if (fs.existsSync(fileName)) {
            const requestFileName = config.image_store + '/tag/' + req.params.tag + '.jpg';
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        } else {
            res.sendFile(config.default_image, {root: './'}, function (err) {
            });
        }
    });

    app.get('/update', function (req, res) {
        console.log('wee');
        const fileName = '/_public/update.json';
        res.sendFile(fileName, {root: './'}, function (err) {
        });

    });

    app.get('/image/:size/:tweetslug.:extension', function (req, res) {
        const size = req.params.size;
        const tweetslug = req.params.tweetslug;
        const extension = req.params.extension;
        const fileName = process.cwd() + config.image_store + '/' + size + '/' + tweetslug + '.' + extension;
        console.log(fileName);
        if (fs.existsSync(fileName)) {
            const requestFileName = config.image_store + '/' + size + '/' + tweetslug + '.' + extension;
            res.sendFile(requestFileName, {root: './'}, function (err) {
            });
        } else {
            console.log(fileName, 'ERROR', 'NOFILE');
            res.sendFile(config.default_image, {root: './'}, function (err) {
            });
        }
    });


    ssr.get('/sitemap.xml', function (req, res) {
        const output = [];
        tweetCollection.find().toArray(function (err, tweetList) {
            tweetList.forEach((tweet) => {
                output.push({
                    'url': {
                        'loc': config.ssr_domain + tweet.slug,
                        'lastmod': tweet.createTime.getFullYear() + '-' + tweet.createTime.getMonth() + '-' + tweet.createTime.getDate(),
                        'priority': 0.8
                    }
                });
            });
            var root = xmlbuilder.create(output);
            res.send(root.end({pretty: true}));
        });
    });

    ssr.get('/tag/:tagslug', function (req, res) {
        const tagslug = req.params.tagslug;
        fs.readFile('ssr.html', 'utf8', (err, data) => {
            if (err) throw err;
            const template = handlebars.compile(data, {strict: true});
            const result = template({
                title: tagslug + ' List',
                description: tagslug + ' List',
                url: config.ssr_domain + 'tag/' + tagslug,
                image: config.ssr_imagepath + 'tag/' + tagslug + '.jpg'
            });
            res.send(result);
        });
    });

    ssr.get('/:tweetslug', function (req, res) {
        const tweetslug = req.params.tweetslug;
        tweetCollection.find({'slug': tweetslug}).toArray(function (err, tweetList) {
            if (tweetList.length === 1) {
                const tweet = tweetList[0];
                fs.readFile('ssr.html', 'utf8', (err, data) => {
                    if (err) throw err;
                    const template = handlebars.compile(data, {strict: true});
                    const result = template({
                        title: tweet.title,
                        description: tweet.description,
                        url: config.ssr_domain + tweet.slug,
                        image: config.ssr_imagepath + 'size1/' + tweet.slug + '.' + tweet.extension
                    });
                    res.send(result);
                });
            } else {
                fs.readFile('ssr.html', 'utf8', (err, data) => {
                    if (err) throw err;
                    const template = handlebars.compile(data, {strict: true});
                    const result = template({
                        title: 'ITCrowd Not Found',
                        description: 'ITCrowd Not Found'
                    });
                    res.send(result);
                });
            }
        });
    });

    ssr.get('/', function (req, res) {
        fs.readFile('ssr.html', 'utf8', (err, data) => {
            if (err) throw err;
            const template = handlebars.compile(data, {strict: true});
            const result = template({
                title: tagslug + ' List',
                description: tagslug + ' List',
                url: config.ssr_domain,
                image: config.ssr_imagepath + 'deafult.jpg'
            });
            res.send(result);
        });
    });

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    })

    ssr.listen(ssr.get('port'), function () {
        console.log('running on port', ssr.get('port'))
    })

});
