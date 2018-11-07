const dbModel = require('./model');

const create = (__slug, __twitter_tweet, __twitter_category, __id = '') => {
    if (__id === '') {
        return new dbModel.model({
            slug: __slug,
            twitter_tweet: __twitter_tweet,
            twitter_category: __twitter_category
        });
    } else {
        return {
            slug: __slug,
            twitter_tweet: __twitter_tweet,
            twitter_category: __twitter_category
        };
    }
};

/**
 * List all records
 */
const list = () => {
    return dbModel.model.find({}, (error, result) => {
        return result;
    }).populate({
            path: 'twitter_category twitter_tweet', populate: {
                path: 'twitter_category twitter_content'
            }
        }
    )
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

const findSlug = (__slug) => {
    return dbModel.model.find({slug: __slug}, (error, result) => {
        return result;
    }).populate({
            path: 'twitter_category twitter_tweet', populate: {
                path: 'twitter_category twitter_content'
            }
        }
    )
}


const remove = (__id) => {
    return new Promise((resolve, reject) => {
        return dbModel.model.remove({_id: __id}, (error) => {
            if (error === null) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    })
}


const add = (__slug, __twitter_tweet, __twitter_category) => {
    return module.exports.findSlug(__slug).then((findResult) => {
        if (findResult.length === 0) {
            const dbRecord = module.exports.create(__slug, __twitter_tweet, __twitter_category);
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


module.exports = {
    create,
    list,
    findID,
    remove,
    findSlug,
    add,
    purge,
    dbModel
}
