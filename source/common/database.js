/**
 * Main Mongoose database connection
 */

const config = require('./config');
const db = require('mongoose');
const util = require('./util');
db.Promise = global.Promise;
db.connect(config.mongo_server, {useNewUrlParser: true}).then((connectionResult) => {
    console.log('Mongo DB Connection OK');
}).catch((errorResult) => {
    util.exit('Mongo DB Connection ERROR');
});
schema = db.Schema;

/**
 * Insert record to Database
 * @param {*} record
 */
const insert = (record) => {
    return new Promise((resolve, reject) => {
        record.save().then((newrecord) => {
            resolve(newrecord);
        }, (e) => {
            reject(e);
        });
    });
}
module.exports = {
    db,
    schema,
    insert
};