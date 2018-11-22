/**
 * Web End Point for Twitter Category
 */

const twitter_content = require('./twitter_content');
const router = (app, upload) => {

    app.get('/twitter/content/list/', function (req, res) {
        twitter_content.list().then((records) => {
            res.send(records);
        })
    });

    app.get('/twitter/content/list/simple/', function (req, res) {
        twitter_content.list().then((records) => {
            res.send(records);
        })
    });

}
module.exports = {
    router
}