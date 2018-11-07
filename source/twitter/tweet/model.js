const database = require('../../common/database');
const twitter_category = require('../category/model');
const twitter_content = require('../content/model');
const schema = new database.schema({
    twitterId: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    shortlink: {
        type: String,
        require: true
    },
    twitterDate: {
        type: Date,
        require: false
    },
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    twitter_category: [
        {type: database.db.Schema.Types.ObjectId, ref: 'twitter_category'}
    ],
    twitter_content:
        {type: database.db.Schema.Types.ObjectId, ref: 'twitter_content'}
}, {
    timestamps: true,
    versionKey: false
});

const model = database.db.model('twitter_tweet', schema);


module.exports = {
    model,
    schema
};
