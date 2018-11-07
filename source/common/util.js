var requestpromise = require('request-promise');
const cheerio = require('cheerio');

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
    const _regex=regex.exec(str);
    return (_regex===null) ? '' : _regex[0];
}

const getMetaFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const _meta = {
            'title': '',
            'url':'',
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

module.exports = {
    exit,
    getHastagsFromText,
    getUrlFromText,
    getMetaFromURL
};