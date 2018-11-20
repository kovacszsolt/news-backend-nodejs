/**
 * Under the Hood Twitter Image Methods
 */
const dbModel = require('./model');

const routeFunction = require('../../route/private');

const create = (__tweet_id, __filename, __size, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            tweet_id: __tweet_id,
            filename: __filename,
            size: __size
        });
    } else {
        return {
            tweet_id: __tweet_id,
            filename: __filename,
            size: __size
        };
    }

};

/**
 * List all records
 */
const list = () => {
    return dbModel.model.find({}, (err, records) => {
        return records;
    });
}

const purge = () => {
    return dbModel.model.deleteMany({}, (err, records) => {
        return records;
    });
}

const findID = (__id) => {
    return dbModel.model.findById(__id, (error, result) => {
        if (error === undefined) {
            return result;
        } else {
            return 0;
        }
    });
}

const find = (__args) => {
    return dbModel.model.find(__args, (error, result) => {
        return result;
    });
}

const findTweetSize = (__tweet_id, __size) => {
    return dbModel.model.find({tweet_id: __tweet_id, size: __size}, (error, result) => {
        return result;
    });
}

const findSize = (__size) => {
    return dbModel.model.find({size: __size}, (error, result) => {
        return result;
    });
}

const findFilename = (__filename) => {
    return dbModel.model.find({filename: __filename}, (error, result) => {
        return result;
    });
}

const add = (__tweet_id, __filename, __size) => {
    const dbRecord = module.exports.create(__tweet_id, __filename, __size);
    dbModel.model.create(dbRecord);
    return dbRecord;
}


module.exports = {
    create,
    list,
    findID,
    findFilename,
    findSize,
    findTweetSize,
    find,
    add,
    purge
}
