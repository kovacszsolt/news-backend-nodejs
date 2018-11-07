const dbModel = require('./model');
const slug = require('slug');
const routeFunction = require('../../route/private');

const create = (__twitterId, __text, __title, __shortlink, __twitterDate, __twitter_category, __content, __id = '') => {
    console.log(__title);
    if (__id === '') {
        return new dbModel.model({
            twitterId: __twitterId,
            text: __text,
            title: __title,
            slug: slug(__title).toLowerCase(),
            shortlink: __shortlink,
            twitterDate: __twitterDate,
            twitter_category: __twitter_category,
            twitter_content: __content
        });
    } else {
        return {
            twitterId: __twitterId,
            text: __text,
            title: __title,
            slug: slug(__title).toLowerCase(),
            shortlink: __shortlink,
            twitterDate: __twitterDate,
            twitter_category: __twitter_category,
            twitter_content: __content
        };
    }
};

/**
 * List all records
 */
const list = () => {
    return dbModel.model.find({}, (error, result) => {
        return result;
    }).populate('twitter_category twitter_content');
}

const add = (__twitterId, __text, __title, __shortlink, __twitterDate, __twitter_category, __content) => {
    return module.exports.findTwitterId(__twitterId).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__twitterId, __text, __title, __shortlink, __twitterDate, __twitter_category, __content);
            dbModel.model.create(dbRecord);
            routeFunction.add(dbRecord.slug, dbRecord._id, null);
            return dbRecord;
        } else {
            return 'error';
        }
    });
}

const findID = (__id) => {
    return dbModel.model.findById(__id, (error, result) => {
        if (error === undefined) {
            return result;
        } else {
            return 0;
        }
    }).populate('twitter_category').populate('twitter_content');
}

const findTwitterId = (__twitterId) => {
    return dbModel.model.find({twitterId: __twitterId}, (error, result) => {
        return result;
    });
}

const findCategory = (__categoryId) => {
    return dbModel.model.find({twitter_category: __categoryId}, (error, result) => {
        return result;
    }).populate('twitter_category twitter_tweet'
    );
}

const find = (__args) => {
    return dbModel.model.find(__args, (error, result) => {
        return result;
    });
}

const purge = () => {
    return dbModel.model.deleteMany({}, (err, records) => {
        return records;
    });
}

module.exports = {
    create,
    list,
    findID,
    add,
    findTwitterId,
    findCategory,
    find,
    purge,
    dbModel
}
