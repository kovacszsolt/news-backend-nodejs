const db = require('./private');
const dbModel = require('./model');

const resultError = {
    OK: 0,
    DUPLICATE_TITLE: 1,
    DELETE_FAILED: 2,
    UPDATE_FAILED_ID_NOTFOUND: 3,
    NOT_FOUND_ID: 4
}

const result = () => {
    return {
        status: resultError.OK,
        result: {}
    };
}

const add = (__slug, __twitter_tweet, __twitter_category) => {
    const _result = result();
    return new Promise((resolve, reject) => {
        db.add(__slug, __twitter_tweet, __twitter_category).then((dbResult) => {
            if (dbResult === 'error') {
                _result.status = resultError.DUPLICATE_TITLE;
                reject(_result);
            } else {
                _result.result = dbResult;
                resolve(_result);
            }
        }, (err) => {
            reject(_result);

        });
    });
}


const findSlug = (__slug) => {
    const _result = result();
    return db.findSlug(__slug).then((findResult) => {
        if (findResult.length===0) {
            _result.status = resultError.NOT_FOUND_ID;
        }
        _result.result = findResult;
        return _result;
    }).catch((e) => {
        _result.status = resultError.NOT_FOUND_ID;
        return _result;
    });
}

const list = () => {
    const _result = result();
    return db.list().then((listResult) => {
        _result.result = listResult;
        return _result;
    });
}

module.exports = {
    resultError,
    add,
    list,
    findSlug
}
