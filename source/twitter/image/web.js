/**
 * Web End Point for Twitter Category
 */

const twitter_image = require('./twitter_image');
const router = (app, upload) => {

    app.get('/twitter/image/list/', function (req, res) {
        twitter_image.list().then((records) => {
            res.send(records);
        })
    });

    app.get('/twitter/image/list/simple/', function (req, res) {
        twitter_image.list().then((records) => {
            res.send(records);
        })
    });

}
module.exports = {
    router
}