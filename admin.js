const image = require('./common/image');

const slug = require('slug');

const request = require('request');
const cheerio = require('cheerio');
const util = require('./common/util');
var {ObjectId} = require('mongodb');
const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const handlebars = require('hbs');
const xmlbuilder = require('xmlbuilder');
const multer = require('multer');

const app = express();

app.set('port', config.port);
const TwitterAPI = require('twitter');
const TwitterClient = new TwitterAPI({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});
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


const getMeta = (url) => {
    return new Promise((resolve, reject) => {

        request(url, function (error, response, body) {
            try {
                if (error === null) {
                    const _cheerio = cheerio.load(body);
                    const _meta = {};
                    _meta.title = _cheerio('meta[property="og:title"]').attr('content');
                    _meta.slug = slug(_meta.title).toLowerCase();
                    _meta.url = _cheerio('meta[property="og:url"]').attr('content');
                    _meta.description = _cheerio('meta[property="og:description"]').attr('content');
                    _meta.image = _cheerio('meta[property="og:image"]').attr('content');
                    if (_meta.image == undefined) {
                        _meta.image = _cheerio('meta[name="twitter:image"]').attr('content');
                    }
                    if (_meta.image.substring(0, 4) !== 'http') {
                        if (_meta.image.substring(0, 2) === '//') {
                            _meta.image = 'http://' + _meta.image.substr(2);
                        } else {
                            _meta.image = _meta.url.split('/').slice(0, 3).join('/') + _meta.image;
                        }
                    }
                    resolve(_meta);
                } else {
                    console.log('url', url);
                    console.log('error', error);
                    reject();
                }
            } catch (ee) {
                console.log('ee', ee);
                reject();
            }
        });
    });
}


const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const tweetCollection = db.collection('tweet');
    const userCollection = db.collection('user');
    const sessionCollection = db.collection('session');
    const settingsCollection = db.collection('setttings');

    app.get('/tweet/meta/get/', function (req, res) {
        const response = {status: 'ok'};
        const tags = [];
        tweetCollection.find().toArray(function (err, tweetList) {
            tweetList.forEach((tweet) => {
                tweet.tags.forEach((tag) => {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                });
            });
            res.json(tags);
        });

    });

    app.get('/session/get/', function (req, res) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        sessionCollection.insertOne({host: ip, create_date: Date.now()}, (error, response) => {
            res.json({id: response.insertedId});
        });
    });


    app.get('/tweet/new/', function (req, res) {
        const response = {status: 'ok'};
        TwitterClient.get('statuses/user_timeline', {
            screen_name: config.twitter_screen_name,
            count: config.read_count
        }, async function (error, tweets, response) {
            tweets = tweets.filter(q => q.retweet_count === 0);
            tweet_count = tweets.length;
            console.log(tweet_count);
            const _tweetList = [];
            const _urls = [];
            tweets.forEach((tweet) => {
                request(util.getUrlFromText(tweet.text), function (error, response, body) {
                    try {
                        if (error === null) {
                            tweet_count--;
                            const _cheerio = cheerio.load(body);
                            _urls.push(
                                {
                                    url: _cheerio('meta[property="og:url"]').attr('content'),
                                    title: _cheerio('meta[property="og:title"]').attr('content')
                                });
                            if (tweet_count === 0) {
                                getNew(res, _urls);
                            }
                        }
                    } catch (e) {

                    }
                });
            });
        });
    });

    /**
     * New Urls
     * @param res
     * @param urls
     */
    getNew = (res, urls) => {
        const urlTmp = urls.map(u => u.url);
        tweetCollection.find({url: {$in: urlTmp}}).toArray(function (err, tweetList) {
            const __url = [];
            tweetList.forEach((tweet) => {
                __url.push(tweet.url);
            });
            const newUrl = [];
            urls.forEach((url) => {
                if (__url.includes(url.url)) {
                    newUrl.push(url);
                }
            });
            res.json(newUrl);
        });
    }

    app.get('/tweet/list/', function (req, res) {
        tweetCollection.find().sort({createTime: -1}).toArray(function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.get('/meta/:url', function (req, res) {
        const response = {status: 'ok'};
        tweetCollection.findOne({url: req.params.url}, function (err, tweet) {
            if (tweet === null) {
                getMeta(req.params.url).then((meta) => {
                    response.data = meta;
                    res.json(response);
                }).catch((error) => {
                    response.status = 'error';
                    res.json(response);
                });
            } else {
                response.status = 'duplicate_error';
                res.json(response);
            }
        });
    });

    app.post('/tweet/save/', upload.array(), function (req, res, next) {
        const data = req.body;
        const response = {status: 'ok'};
        const extension = util.getFileExtension(data.image);
        const targetPath = process.cwd() + config.image_store + '/original/';
        fs.ensureDirSync(targetPath);
        const targetFileOriginal = targetPath + data.slug + '.' + extension;
        util.downloadFromURL(data.image, targetFileOriginal).then((a) => {
            const record = {
                id: '',
                text: '',
                shorturl: '',
                tags: [],
                createTime: new Date(),
                title: data.title,
                url: data.url,
                description: data.description,
                image: data.image,
                slug: data.slug,
                tags: data.tags,
                status: 1,
                extension: util.getFileExtension(data.image)
            }
            tweetCollection.insertOne(record, function (err, result) {
                let imageCount = config.image_sizes.length;
                config.image_sizes.forEach((imageSize) => {
                    const file = data.slug + '.' + extension;
                    const targetPath = process.cwd() + config.image_store + '/' + imageSize.name + '/';
                    fs.ensureDirSync(targetPath);
                    image.resize(process.cwd() + config.image_store + '/original/' + file, targetPath + file, imageSize.width, imageSize.height).then((a) => {
                        imageCount--;
                        if (imageCount === 0) {
                            res.json(response);
                        }
                    });
                });
            });
        }).catch((e) => {
            res.json(response);
        });
    });


    /**
     * Login
     */
    app.post('/user/login/', upload.array(), function (req, res, next) {
        const userObj = {email: '', password: ''};
        const body = req.body;
        const response = {status: 'ok'};
        try {
            if (req.headers.id === undefined) {
                response.status = 'header_error';
                res.json(response);
            }
            if (JSON.stringify(Object.keys(body)) === JSON.stringify(Object.keys(userObj))) {
                Object.keys(body).forEach((field) => {
                    if (body[field] === '') {
                        response.status = 'validation_error-2';
                        res.json(response);
                    }
                });
                sessionCollection.findOne({_id: ObjectId(req.headers.id)}, function (err, session) {
                    console.log(session);
                    if (session === null) {
                        response.status = 'key_error';
                        res.json(response);
                    } else {
                        userCollection.findOne(body, function (err, user) {
                            if (user === null) {
                                response.status = 'no_user';
                                res.json(response);
                            } else {
                                user.password = '';
                                response.status = 'ok';
                                response.data = user;
                                sessionCollection.updateOne({_id: ObjectId(req.headers.id)}, {$set: {user: user}}, (err, session) => {
                                    console.log('err', err);
                                    console.log('session', session);
                                    res.json(response);
                                });

                            }
                        });
                    }
                });
            } else {
                response.status = 'validation_error-1';
                res.json(response);
            }
        } catch (e) {
            console.log(e);
            response.status = 'global_error';
            res.json(response);
        }
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
