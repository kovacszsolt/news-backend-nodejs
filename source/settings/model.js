/**
 * Settings Model
 * @type {{db, schema, insert}|*}
 */

const database = require('./../common/database');


const schema = new database.schema({
    key: {
        type: String,
        require: true
    },
    value: {
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
const model = database.db.model('settings', schema);


module.exports = {
    model,
    schema
};