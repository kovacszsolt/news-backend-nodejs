/**
 * Web End Point for Images
 */
const config = require('../../common/config');
const tweetFunction = require('../tweet/private');
const fs = require('fs-extra');
const router = (app, upload) => {

    app.get('/image/test/', function (req, res) {
        res.send('hello');
    });
    app.get('/image/:size/:tweetslug.:extension', function (req, res) {
        const size = req.params.size;
        const tweetslug = req.params.tweetslug;
        const extension = req.params.extension;
        tweetFunction.findTwitterSlug(tweetslug).then((findTwitterSlugResponse) => {
            if (findTwitterSlugResponse.length === 1) {
                const fileName = config.root_path + config.image_store + '/' + size + '/' + findTwitterSlugResponse[0]._id + '.' + extension;
                if (fs.existsSync(fileName)) {
                    const requestFileName = config.image_store + '/' + size + '/' + findTwitterSlugResponse[0]._id + '.' + extension;
                    res.sendFile(requestFileName, {root: './'}, function (err) {
                        console.log(fileName, err);
                    });
                } else {
                    res.sendFile(config.default_image, {root: './'}, function (err) {
                    });
                }
            } else {
                res.sendFile(config.default_image, {root: './'}, function (err) {
                    console.log(err);
                });
            }
        });

    });


}
module.exports = {
    router
}