const dbModel = require('./model');
const slug = require('slug');
const routeFunction = require('../../route/private');

const create = (__twitterId, __text, __title, __url, __twitterDate, __twitter_category, __content, __imageurl, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            twitterId: __twitterId,
            text: __text,
            title: __title,
            slug: slug(__title).toLowerCase(),
            url: __url,
            twitterDate: __twitterDate,
            twitter_category: __twitter_category,
            content: __content,
            imageurl: __imageurl
        });
    } else {
        return {
            twitterId: __twitterId,
            text: __text,
            title: __title,
            slug: slug(__title).toLowerCase(),
            url: __url,
            twitterDate: __twitterDate,
            twitter_category: __twitter_category,
            content: __content,
            imageurl: __imageurl
        };
    }
};

/**
 * List all records
 */
const list = () => {
    return dbModel.model.find({}, (error, result) => {
        return result;
    });
   // }).populate('twitter_category twitter_image');
}

const listSimple = () => {
    return dbModel.model.find({}, (error, result) => {
        return result;
    });
}

const add = (__twitterId, __text, __title, __url, __twitterDate, __twitter_category, __content, __imageurl) => {
    return module.exports.findTwitterId(__twitterId).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__twitterId, __text, __title, __url, __twitterDate, __twitter_category, __content, __imageurl);
            dbModel.model.create(dbRecord);
            routeFunction.add(dbRecord.slug, dbRecord._id, null);
            return dbRecord;
        } else {
            return 'error';
        }
    });
}

const findMulipleCategoryById = (__categoryIds) => {
    return dbModel.model.find(
        {
            'twitter_category': {
                $in: __categoryIds
            }
        }
    ).populate('twitter_category twitter_image').then((result) => {
        return result;
    });
};

const addImages = (__id, images) => {
    dbModel.model.findById(__id, (error, result) => {
        result.twitter_image = images;
        dbModel.model.findByIdAndUpdate(__id, result, (updateErr, updateRes) => {
            return updateRes;
        });
    });
}

const removeImages = (__id) => {
    dbModel.model.find(__id, (error, result) => {
        result.twitter_image = [];
        dbModel.model.findByIdAndUpdate(__id, result, (updateErr, updateRes) => {
            return updateRes;
        });
    });
}

const findID = (__id) => {
    return dbModel.model.findById(__id, (error, result) => {
        if (error === undefined) {
            return result;
        } else {
            return 0;
        }
    }).populate('twitter_category');
}

const findTwitterId = (__twitterId) => {
    return dbModel.model.find({twitterId: __twitterId}, (error, result) => {
        return result;
    });
}

const findCategory = (__categoryId) => {
    return dbModel.model.find({twitter_category: __categoryId}, (error, result) => {
        return result;
    }).populate({
        path: 'twitter_tweet twitter_category'
    })
}

const find = (__args) => {
    return dbModel.model.find(__args, (error, result) => {
        return result;
    }).populate('twitter_category');
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
    addImages,
    listSimple,
    find,
    purge,
    removeImages,
    findMulipleCategoryById,
    dbModel
}
