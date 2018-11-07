/**
 * Under the Hood Twitter Content Methods
 */

const dbModel = require('./model');

const create = (__title, __url, __content, __imageurl, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            title: __title,
            url: __url,
            content: __content,
            imageurl: __imageurl
        });
    } else {
        return {
            title: __title,
            url: __url,
            content: __content,
            imageurl: __imageurl
        };
    }
};

const findUrl = (__url) => {
    return dbModel.model.find({url: __url}, (error, result) => {
        return result;
    });
}

const add = (__title, __url, __content, __imageurl) => {
    return module.exports.findUrl(__url).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__title, __url, __content, __imageurl);
            dbModel.model.create(dbRecord);
            return dbRecord;
        } else {
            return 'error';
        }
    });
}

const purge = () => {
    return dbModel.model.deleteMany({}, (err, records) => {
        return records;
    });
}

const list = () => {
    return dbModel.model.find({}, (error, result) => {
        return result;
    });
}

module.exports = {
    create,
    list,
    findUrl,
    add,
    purge,
    dbModel
}
