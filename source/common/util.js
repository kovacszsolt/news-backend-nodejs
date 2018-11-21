var requestpromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const exit = (__message) => {
    console.log('-------------------------');
    console.log('-------------------------');
    console.log(__message);
    console.log('-------------------------');
    console.log('-------------------------');
    process.exit(-1);
}

/**
 * Find hastag tags in String
 * @param str
 * @returns {Array}
 */
const getHastagsFromText = (str) => {
    const regex = /(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)/g;
    let _regexResult;
    const _return = [];
    while ((_regexResult = regex.exec(str)) !== null) {
        if (_regexResult.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        _regexResult.map((match, index) => {
            if (index === 1) {
                _return.push(match.toLowerCase());
            }
        });
    }
    return _return;
}

/**
 * Find URL in String
 * @param str
 * @returns {string}
 */
const getUrlFromText = (str) => {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const _regex = regex.exec(str);
    return (_regex === null) ? '' : _regex[0];
}

const getMetaFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const _meta = {
            'title': '',
            'url': '',
            'description': '',
            'image': ''
        }
        const options = {
            uri: url
        };
        requestpromise(options)
            .then(function (response) {
                const _cheerio = cheerio.load(response);
                _meta.title = _cheerio('meta[property="og:title"]').attr('content');
                _meta.url = _cheerio('meta[property="og:url"]').attr('content');
                _meta.description = _cheerio('meta[property="og:description"]').attr('content');
                _meta.image = _cheerio('meta[property="og:image"]').attr('content');
                resolve(_meta);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


const downloadFromURL = (url, target) => {
    console.log('url', url);
    if (url !== undefined) {
        if (url.substring(0, 2) === '//') {
            url = 'http:' + url;
        }
    }
    return new Promise((resolve, reject) => {
        if ((url.substring(0, 1) === '/') || (url === undefined)) {
            resolve(false);
        }
        const options = {
            uri: url,
            method: 'GET',
            encoding: "binary"
        };
        requestpromise(options)
            .then(function (body, data) {
                let writeStream = fs.createWriteStream(target);
                writeStream.write(body, 'binary');
                writeStream.on('finish', () => {
                    resolve(true);
                });
                writeStream.end();
            })
            .catch(function (err) {
                console.log('requestpromise.catch', url);
                reject(err);
            });
    });
}

module.exports = {
    exit,
    getHastagsFromText,
    getUrlFromText,
    getMetaFromURL,
    downloadFromURL
};