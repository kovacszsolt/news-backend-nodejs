/**
 * Under the Hood Twitter Category Methods
 */
const dbModel = require('./model');

const routeFunction = require('../../route/private');

const slug = require('slug');

const create = (__title, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            title: __title,
            slug: slug(__title).toLowerCase()
        });
    } else {
        return {
            title: __title,
            slug: slug(__title).toLowerCase()
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

const findSlug = (__slug) => {
    return dbModel.model.find({slug: __slug}, (error, result) => {
        return result;
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

const findTitle = (__title) => {
    return dbModel.model.find({title: __title}, (error, result) => {
        return result;
    });
}

const add = (__title) => {
    return module.exports.findTitle(__title).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__title);
            dbModel.model.create(dbRecord);
            routeFunction.add(dbRecord.slug, null, dbRecord._id);
            return dbRecord;
        } else {
            return 'error';
        }
    });
}

/**
 * Store category in database
 * if exits, return the object
 * @param name
 * @returns {Promise<any>}
 */
const storeCategory = (name) => {
    return new Promise((resolve, reject) => {
        module.exports.findTitle(name).then((result) => {
            if (result.length === 0) {
                module.exports.add(name).then((addResult) => {
                    resolve(addResult);
                });
            } else {
                resolve(result[0]);
            }
        }).catch((findError) => {
            reject(findError);
        });
    });
}

/**
 * Store more category (from array)
 * @param _categories
 * @returns {Promise<any>}
 */
const storeArrayCategory = (_categories) => {
    return new Promise((resolve, reject) => {
        let restCategory = _categories.length;
        const categoryObjects = [];
        _categories.map((_category) => {
            module.exports.storeCategory(_category).then((storeResult) => {
                categoryObjects.push(storeResult);
                restCategory--;
                // until process all category
                if (restCategory === 0) {
                    resolve(categoryObjects);
                }
            }).catch((storeError) => {
                reject(storeError);
            });
        });
    });
}


module.exports = {
    create,
    list,
    findID,
    findTitle,
    find,
    add,
    purge,
    findSlug,
    storeCategory,
    storeArrayCategory
}
