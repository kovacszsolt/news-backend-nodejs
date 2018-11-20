/**
 * Twitter Image Model
 * @type {{db, schema, insert}|*}
 */

const database = require('./../../common/database');
const twitter_tweet = require('../tweet/model');

const schema = new database.schema({
    tweet_id:
        {type: database.db.Schema.Types.ObjectId, ref: 'twitter_tweet'},
    filename: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});
/**
 * Mongo database schema
 */
const model = database.db.model('twitter_image', schema);


module.exports = {
    model,
    schema
};