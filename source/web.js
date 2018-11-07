/**
 * Web End Point
 * RUN THIS
 */

const config=require('./common/config');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const multer = require('multer');

const routeRouter = require('./route/web');

const twitterTweetRouter = require('./twitter/tweet/web');


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


const upload = multer();
app.use(express.static(__dirname + '/_public'));

routeRouter.router(app, upload);

twitterTweetRouter.router(app, upload);

app.get('/', function (req, res) {
    res.send({data: 'hello world'});
});

app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
