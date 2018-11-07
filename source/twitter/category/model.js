/**
 * Twitter Category Model
 * @type {{db, schema, insert}|*}
 */

const database = require('./../../common/database');


const schema = new database.schema({
    title: {
        type: String,
        require: true
    },
    slug: {
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
const model = database.db.model('twitter_category', schema);


module.exports = {
    model,
    schema
};