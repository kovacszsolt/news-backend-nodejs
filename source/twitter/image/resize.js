const twitterImage = require('./private');
const sharp = require('sharp');


twitterImage.list().then((twitterImageListResult) => {
    console.log(twitterImageListResult);
    twitterImageListResult.map((mapResult) => {
        sharp('_public/images/original/' + mapResult._id + '.jpg')
            .rotate()
            .resize(614)
            .toFile('_public/images/resized/' + mapResult._id + '.jpg', (err, info) => {
                console.log('err - ' + mapResult._id, err);
            });
    });

    //process.exit(0);
});
