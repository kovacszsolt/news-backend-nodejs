const db = require('./private');
const dbModel = require('./model');

const resultError = {
    OK: 0
}

const result = () => {
    return {
        status: resultError.OK,
        result: {}
    };
}

const list = () => {
    const _result = result();
    return db.list().then((listResult) => {
        _result.result = listResult;
        return _result;
    });
}

module.exports = {
    list
}
