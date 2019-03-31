const request = require('request');
const util = require('./util');
const cheerio = require('cheerio');
const slug = require('slug');
const config = require('./config');
const getMetaFromUrlMulti = (urls, extra) => {
    return Promise.all(
        urls.map((url) => {
                return getMetaFromUrl(url, extra)
            }
        ));
};

const getMetaFromUrl = (url, extra) => {
    return new Promise((resolve, reject) => {
        request(util.getUrlFromText(url), function (error, response, body) {
            try {
                if (error === null) {
                    const meta = getMetaFromBody(body, response.request);
                    if (meta.url === undefined) {
                        const _find = config.domain_change.find(f => f.originalhost === response.request.host);
                        if (_find !== undefined) {
                            const newUrl = response.request.uri.protocol + '//' + _find.newhost + response.request.uri.path;
                            getMetaFromUrl(newUrl, extra).then((newResponse) => {
                                resolve(newResponse);
                            }).catch((e) => {
                                reject(e);
                            });
                        } else {
                            reject({error: 'nourl'});
                        }
                    } else {
                        Object.keys(extra).forEach((key => {
                            meta[key] = extra[key];
                        }));
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
const getMetaFromBody = (body, response_request) => {
    const _cheerio = cheerio.load(body);
    const meta = {
        error: false
    };
    meta.url = _cheerio('meta[property="og:url"]').attr('content');
    if (meta.url === undefined) {
        meta.url = _cheerio('link[rel="canonical"]').attr('href');
        if (meta.url === undefined) {
            meta.url = response_request.uri.href;
        }
    }
    meta.title = _cheerio('meta[property="og:title"]').attr('content');
    if (meta.title === undefined) {
        meta.title = _cheerio('title').text();
    }
    meta.description = _cheerio('meta[property="og:description"]').attr('content');
    if (meta.description === undefined) {
        meta.description = '';
    }
    meta.image = _cheerio('meta[property="og:image"]').attr('content');
    if (meta.url === undefined) {
        return meta;
    }
    if (meta.image === undefined) {
        meta.image = _cheerio('meta[name="twitter:image"]').attr('content');
    }
    meta.slug = slug(meta.title).toLowerCase();
    if (meta.image === undefined) {
        meta.image = '';
        meta.extension = '';
        meta.error = true;
    } else {
        if (meta.image.substring(0, 4) !== 'http') {
            if (meta.image.substring(0, 2) === '//') {
                meta.image = 'http://' + meta.image.substr(2);
            } else {
                meta.image = meta.url.split('/').slice(0, 3).join('/') + meta.image;
            }
        }
        meta.extension = util.getFileExtension(meta.image);
    }

    return meta;
}

module.exports = {
    getMetaFromUrl,
    getMetaFromUrlMulti
};
