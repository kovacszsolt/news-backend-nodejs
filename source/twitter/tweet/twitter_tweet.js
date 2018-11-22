const db = require('./private');
const category = require('../category/private');
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

const listSimple = () => {
    const _result = result();
    return db.listSimple().then((listResult) => {
        _result.result = listResult;
        return _result;
    });
}

const findMultipleTweetsByCategoryIds = (__categoryTags) => {
    const _result = result();
    return new Promise((resolve, reject) => {
        Promise.all(
            __categoryTags.map((categoryTag) => {
                return category.findSlug(categoryTag).then((findSlugResult) => {
                    return findSlugResult[0];
                })
            })).then((promiseResult) => {
            db.findMulipleCategoryById(promiseResult.map((promiseResultItem) => {
                return promiseResultItem._id
            })).then((findMulipleCategoryByIdResult) => {
                _result.result = findMulipleCategoryByIdResult;
                resolve(_result);
            }).catch((findMulipleCategoryByIdError) => {
                _result.status = resultError.NOT_FOUND_ID;
                _result.result = findMulipleCategoryByIdError;
                reject(_result);
            });
        });
    });
}

module.exports = {
    resultError,
    findMultipleTweetsByCategoryIds,
    list,
    listSimple
}
