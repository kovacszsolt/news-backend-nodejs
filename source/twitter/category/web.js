/**
 * Web End Point for Twitter Category
 */

const twitter_category = require('./twitter_category');
const router = (app, upload) => {

    app.get('/twitter/category/list/', function (req, res) {
        twitter_category.list().then((records) => {
            res.send(records);
        })
    });

    app.get('/twitter/category/list/simple/', function (req, res) {
        twitter_category.list().then((records) => {
            res.send(records);
        })
    });

}
module.exports = {
    router
}