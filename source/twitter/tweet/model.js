const database = require('../../common/database');
const twitter_category = require('../category/model');
const twitter_content = require('../content/model');
const twitter_image = require('../image/model');
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
    url: {
        type: String,
        require: false
    },
    content: {
        type: String,
        require: false
    },
    imageurl: {
        type: String,
        require: false
    },
    twitter_category: [
        {type: database.db.Schema.Types.ObjectId, ref: 'twitter_category'}
    ],
    twitter_image: [
        {type: database.db.Schema.Types.ObjectId, ref: 'twitter_image'}
    ]
}, {
    timestamps: true,
    versionKey: false
});

const model = database.db.model('twitter_tweet', schema);


module.exports = {
    model,
    schema
};
