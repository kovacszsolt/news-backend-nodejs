/**
 * Web End Point for Twitter Category
 */

const settings = require('./settings');
const router = (app, upload) => {

    app.get('/settings/list/', function (req, res) {
        settings.list().then((records) => {
            res.send(records);
        })
    });

    app.get('/settings/updatetime/', function (req, res) {
        settings.findUPDATEKEY().then((records) => {
            res.send(records);
        })
    });

}
module.exports = {
    router
}