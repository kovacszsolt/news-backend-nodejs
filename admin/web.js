var {ObjectId} = require('mongodb');
const config = require('../common/config');
const express = require('express');
const bodyParser = require('body-parser');


const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const userCollection = db.collection('user');
    const sessionCollection = db.collection('session');

    const app = express();
    app.set('port', config.admin.port);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', config.allow_origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    app.all('*', function (req, res, next) {
        if (req.method === 'OPTIONS') {
            // always allow the OPTIONS
            next();
        } else {
            if (config.admin.no_header_url.includes(req.url)) {
                next();
            } else {
                if (req.headers.key === undefined) {
                    res.status(500).send({status: 'no header key'});
                } else {
                    sessionCollection.find({_id: ObjectId(req.headers.key)}).toArray(function (err, sessionList) {
                        if (sessionList.length === 0) {
                            res.status(500).send({status: 'wrong header key'});
                        } else {
                            if (config.admin.no_user_url.includes(req.url)) {
                                next();
                            } else {
                                if (sessionList.user === undefined) {
                                    res.status(500).send({status: 'no user'});
                                } else {
                                    next();
                                }
                            }
                        }
                    });
                }
            }
        }
    });

    app.get('/', function (req, res) {
        res.send({data: 'hello backend world'});
    });

    app.get('/session/add/', function (req, res) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        sessionCollection.insertOne({host: ip, create_date: Date.now()}, (error, response) => {
            res.json({id: response.insertedId});
        });
    });

    app.get('/user/init/', function (req, res) {
        userCollection.find().toArray(function (err, userList) {
            if (userList.length === 0) {
                userCollection.insertOne({username: "smith.zsolt@gmail.com", password: "123"}, function (err, result) {
                    res.json({status: "ok"});
                });
            } else {
                res.json({status: "ok"});
            }
        });
    });

    app.get('/user/hello/', function (req, res) {
        res.json({status: "ok", message: "hello"});
    });

    app.get('/user/hello1/', function (req, res) {
        res.json({status: "ok", message: "hello1"});
    });

    app.post('/user/login/', function (req, res, next) {
        if (JSON.stringify(Object.keys(req.body)) === JSON.stringify(['username', 'password'])) {
            userCollection.find({username: req.body.username}).toArray(function (err, userList) {
                if (userList.length === 1) {
                    const user = {...userList[0]};
                    delete user.password;
                    const userData = {
                        user: user
                    };
                    sessionCollection.updateOne({_id: ObjectId(req.headers.key)}, {$set: userData}, (err, response) => {
                        res.json({status: "ok"});
                    });
                } else {
                    res.json({status: "error"});
                }
            });
        } else {
            res.json({status: "error"});
        }
    });

    app.delete('/user/login/', function (req, res) {
        sessionCollection.find({_id: ObjectId(req.headers.key)}).toArray(function () {
            sessionCollection.deleteOne({_id: ObjectId(req.headers.key)}, () => {
                res.json({status: "ok"});
            });
        });
    });

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    });

});


/*
var {ObjectId} = require('mongodb');
const config = require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const image = require('./image');
const app = express();
const util = require('util');
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
const upload = multer();
app.get('/', function (req, res) {
    res.send({data: 'hello backend world'});
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const multerUpload = multer({storage: storage}).single('file');


const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const imageCollection = db.collection('image');
    const userCollection = db.collection('user');
    const sessionCollection = db.collection('session');


    app.all('*', function (req, res, next) {
        if (req.method === 'OPTIONS') {
            // always allow the OPTIONS
            next();
        } else {
            console.log(req.headers.key);
            next();
        }
    });

    app.get('/user/init/', function (req, res) {
        userCollection.find().toArray(function (err, userList) {
            if (userList.length === 0) {
                userCollection.insertOne({username: "smith.zsolt@gmail.com", password: "123"}, function (err, result) {
                    res.json({status: "ok - init"});
                });
            } else {
                res.json({status: "ok - ready"});
            }
        });
    });

    app.post('/user/login/', function (req, res, next) {
        console.log('req', req.body);
        if (JSON.stringify(Object.keys(req.body)) === JSON.stringify(['username', 'password'])) {
            userCollection.find({username: req.body.username}).toArray(function (err, userList) {
                console.log('userList', userList);
                if (userList.length === 1) {
                    const user = {...userList[0]};
                    delete user.password;
                    console.log('user', user);
                    sessionCollection.insertOne({user: user}, function (err, result) {
                        console.log('result', result);
                        res.json({status: "ok", sessionId: result.insertedId});
                    });

                } else {
                    res.json({status: "error"});
                }
            });
        } else {
            res.json({status: "error"});
        }
    });

    app.post('/image/composeupload/', function (req, res, next) {
        multerUpload(req, res, function (err) {
            console.log('./tmp/' + req.file.originalname);
            const composeData = image.readComposeFile('./tmp/' + req.file.originalname);
            console.log(util.inspect(composeData, false, null, true));
            res.json(composeData);
        });
        //res.json({a: 'b'});
    });

    app.get('/image/list/', function (req, res) {
        imageCollection.find().toArray(function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.get('/image/:id', function (req, res) {
        imageCollection.find({_id: ObjectId(req.params.id)}).toArray(function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.delete('/image/:id', function (req, res) {
        imageCollection.deleteOne({_id: ObjectId(req.params.id)}, function (err, tweetList) {
            res.json(tweetList);
        });
    });

    app.put('/image/item/', function (req, res) {
        const data = req.body;
        const response = {status: 'ok'};
        const newData = {...data};
        delete newData._id;
        imageCollection.updateOne({_id: ObjectId(data._id)}, {$set: newData}, (err, session) => {
            res.json(response);
        });
    });

    app.post('/image/item/', upload.array(), function (req, res, next) {
        const data = req.body;
        console.log('data', data);
        const response = {status: 'ok'};
        imageCollection.insertOne(data, function (err, result) {
            console.log(err);
            res.json({id: result.insertedId});

        });
    });
});

app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
});

*/

