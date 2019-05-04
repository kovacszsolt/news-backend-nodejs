const fs = require('fs-extra');
const handlebars = require('hbs');
const xmlbuilder = require('xmlbuilder');
module.exports = class ssrClass {

    constructor(tweetCollection, config) {
        this.tweetCollection = tweetCollection;
        this.config = config;
    }


    sitemap() {
        return new Promise((resolve, reject) => {
            const output = [];
            this.tweetCollection.find().toArray(function (err, tweetList) {
                tweetList.forEach((tweet) => {
                    output.push({
                        'url': {
                            'loc': this.config.ssr_domain + tweet.slug,
                            'lastmod': tweet.createTime.getFullYear() + '-' + tweet.createTime.getMonth() + '-' + tweet.createTime.getDate(),
                            'priority': 0.8
                        }
                    });
                });
                resolve(xmlbuilder.create(output));
            });
        });
    }

    tag(tagslug) {
        return new Promise((resolve, reject) => {
            fs.readFile('ssr.html', 'utf8', (err, data) => {
                if (err) throw err;
                const template = handlebars.compile(data, {strict: true});
                const result = template({
                    title: tagslug + ' List',
                    description: tagslug + ' List',
                    url: config.ssr_domain + 'tag/' + tagslug,
                    image: config.ssr_imagepath + 'tag/' + tagslug + '.jpg'
                });
                resolve(result);
            });
        });
    }

    tweet(tweetslug) {
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({'slug': tweetslug}).toArray(function (err, tweetList) {
                if (tweetList.length === 1) {
                    const tweet = tweetList[0];
                    fs.readFile('ssr.html', 'utf8', (err, data) => {
                        if (err) throw err;
                        const template = handlebars.compile(data, {strict: true});
                        const result = template({
                            title: tweet.title,
                            description: tweet.description,
                            url: this.config.ssr_domain + tweet.slug,
                            image: this.config.ssr_imagepath + 'size1/' + tweet.slug + '.' + tweet.extension
                        });
                        resolve(result);
                    });
                } else {
                    fs.readFile('ssr.html', 'utf8', (err, data) => {
                        if (err) throw err;
                        const template = handlebars.compile(data, {strict: true});
                        const result = template({
                            title: 'ITCrowd Not Found',
                            description: 'ITCrowd Not Found'
                        });
                        resolve(result);
                    });
                }
            });
        });
    }

    root() {
        return new Promise((resolve, reject) => {
            fs.readFile('ssr.html', 'utf8', (err, data) => {
                if (err) throw err;
                const template = handlebars.compile(data, {strict: true});
                const result = template({
                    title: tagslug + ' List',
                    description: tagslug + ' List',
                    url: config.ssr_domain,
                    image: config.ssr_imagepath + 'deafult.jpg'
                });
                resolve(result);
            });
        });
    }
}

