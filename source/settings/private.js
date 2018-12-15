/**
 * Under the Hood Settings Methods
 */
const dbModel = require('./model');

const create = (__key, __value, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            key: __key,
            value: __value
        });
    } else {
        return {
            key: __key,
            value: __value
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

const findKey = (__key) => {
    return dbModel.model.find({key: __key}, (error, result) => {
        return result;
    });
}

const add = (__key, __value) => {
    return module.exports.findKey(__key).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__key, __value);
            dbModel.model.create(dbRecord);
            return dbRecord;
        } else {
            return 'error';
        }
    });
}

const update = (__key, __value) => {
    return module.exports.findKey(__key).then((findResult) => {
        findResult = findResult[0];
        findResult.value = __value;
        dbModel.model.findByIdAndUpdate(findResult._id, findResult, function (err, model) {
            return model;
        });
    });
}


module.exports = {
    create,
    list,
    findID,
    findKey,
    find,
    add,
    update,
    purge
}
