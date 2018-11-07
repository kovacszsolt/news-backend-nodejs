/**
 * Twitter Content Model
 * @type {{db, schema, insert}|*}
 */

const database = require('../../common/database');

const schema = new database.schema({
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    imageurl: {
        type: String,
        require: false
    }
}, {
    timestamps: true,
    versionKey: false
});


const model = database.db.model('twitter_content', schema);


module.exports = {
    model,
    schema
};
