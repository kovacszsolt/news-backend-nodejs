const request = require('request');
const util = require('./util');
const cheerio = require('cheerio');
const slug = require('slug');
const config = require('./config');
const getMetaFromUrl = (url, extra) => {
    return new Promise((resolve, reject) => {
        request(util.getUrlFromText(url), function (error, response, body) {
            try {
                if (error === null) {
                    const meta = getMetaFromBody(body);
                    if (meta.url === undefined) {
                        const _find = config.domain_change.find(f => f.originalhost === response.request.host);
                        if (_find !== undefined) {
                            getMetaFromUrl(response.request.uri.protocol + '//' + _find.newhost + response.request.uri.path, extra).then((newResponse) => {
                                resolve(newResponse);
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                    } else {
                        Object.keys(extra).forEach((key => {
                            meta[key] = extra[key];
                        }));
                        //meta.created_at = created_at;
                        resolve(meta);
                    }
                } else {
                    reject({error: error, response: response});
                }
            } catch (e) {
                reject({error: e});
            }
        });
    });
}
const getMetaFromBody = (body) => {
    const _cheerio = cheerio.load(body);
    const meta = {};
    meta.url = _cheerio('meta[property="og:url"]').attr('content');
    meta.title = _cheerio('meta[property="og:title"]').attr('content');
    meta.description = _cheerio('meta[property="og:description"]').attr('content');
    meta.image = _cheerio('meta[property="og:image"]').attr('content');
    if (meta.url === undefined) {
        return meta;
    }
    if (meta.image === undefined) {
        meta.image = _cheerio('meta[name="twitter:image"]').attr('content');
    }
    meta.slug = slug(meta.title).toLowerCase();
    if (meta.image.substring(0, 4) !== 'http') {
        if (meta.image.substring(0, 2) === '//') {
            meta.image = 'http://' + meta.image.substr(2);
        } else {
            meta.image = meta.url.split('/').slice(0, 3).join('/') + meta.image;
        }
    }
    meta.extension = util.getFileExtension(meta.image);
    return meta;
}

module.exports = {
    getMetaFromUrl
};