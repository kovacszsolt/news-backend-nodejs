var requestpromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fsextra = require('fs-extra');
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

/**
 * get extension from file name
 * @param file
 * @returns {string[]}
 */
const getFileExtension = (file) => {
    let _return = file;
    _return = file.split('.').slice(file.split('.').length - 1).toString();
    if (_return.indexOf('?') !== -1) {
        _return = _return.substring(0, _return.indexOf('?'));
    }
    return _return;
}

const getMetaFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const _meta = {
            'error': true,
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
                _meta.error = false;
                _meta.title = _cheerio('meta[property="og:title"]').attr('content');
                _meta.url = _cheerio('meta[property="og:url"]').attr('content');
                _meta.description = _cheerio('meta[property="og:description"]').attr('content');
                _meta.image = _cheerio('meta[property="og:image"]').attr('content');
                if (_meta.image.substring(0, 4) !== 'http') {
                    if (_meta.image.substring(0, 2) === '//') {
                        _meta.image = 'http://' + _meta.image.substr(2);
                    } else {
                        _meta.image = _meta.url.split('/').slice(0, 3).join('/') + _meta.image;
                    }
                }
                resolve(_meta);
            })
            .catch(function (err) {
                console.log('getMetaFromURL.err', err);
                resolve(_meta)
                /*
                console.log(options);
                console.log('getMetaFromURL', err);
                process.exit(-2);
                reject(err);
*/
            });
    });
}


const downloadFromURL = (url, target) => {
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
        const targetArray = target.split('/');
        fsextra.ensureDirSync(targetArray.slice(0, targetArray.length - 1).join('/'));
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
                console.log('err', err);
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
    downloadFromURL,
    getFileExtension
};