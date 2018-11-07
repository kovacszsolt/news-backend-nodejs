const database = require('./../common/database');
const twitter_category = require('../twitter/category/model');
const twitter_tweet = require('../twitter/tweet/model');

const schema = new database.schema({
    slug: {
        type: String,
        require: true
    },
    twitter_tweet: {
        type: database.db.Schema.Types.ObjectId, ref: 'twitter_tweet'
    },
    twitter_category: {
        type: database.db.Schema.Types.ObjectId, ref: 'twitter_category'
    }
}, {
    timestamps: true,
    versionKey: false
});
/**
 * Mongo database schema
 */
const model = database.db.model('route', schema);


module.exports = {
    model,
    schema
};
