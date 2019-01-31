const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const handlebars = require('hbs');
const xmlbuilder = require('xmlbuilder');
const multer = require('multer');

const app = express();

app.set('port', config.port);

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
    res.send({data: 'hello backend world'});
});

const upload = multer();

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const settingsCollection = db.collection('setttings');


    app.post('/user/login/', upload.array(), function (req, res, next) {
        console.log('req', req);
        console.log('res', res);
    });

    app.get('/update/', function (req, res) {
        settingsCollection.find({'key': 'update'}).toArray(function (err, settingsList) {
            res.json(settingsList[0]);
        });
    });

    app.get('/list/', function (req, res) {
        tweetCollection.find().toArray(function (err, tweetList) {
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

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    })

});
