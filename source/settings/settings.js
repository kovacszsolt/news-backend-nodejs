const db = require('./private');
const randomstring = require('randomstring');

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

const findUPDATEKEY = () => {
    const _result = result();
    return db.findKey('UPDATEKEY').then((listResult) => {
        _result.result = listResult[0];
        return _result;
    });
}

const updateTime = () => {
    const newKey = randomstring.generate();
    return db.findKey('UPDATEKEY').then((record) => {
        if (record.length === 0) {
            db.add('UPDATEKEY', newKey);
        } else {
            db.update('UPDATEKEY', newKey);
        }
        return newKey;
    });

}

module.exports = {
    list,
    updateTime,
    findUPDATEKEY
}
