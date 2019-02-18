const fs = require('fs-extra');
const image = require('../common/image');
const config = require('../common/config');
config.image_sizes.forEach((imageSize) => {
    const targetPath = process.cwd() + config.image_store + '/' + imageSize.name + '/';
    fs.ensureDirSync(targetPath);
});
fs.readdir(process.cwd() + config.image_store + '/original/', function (err, fileList) {
    let currentPos = fileList.length * config.image_sizes.length;
    fileList.forEach((file) => {
        config.image_sizes.forEach((imageSize) => {
            const targetPath = process.cwd() + config.image_store + '/' + imageSize.name + '/';
            if (!fs.existsSync(targetPath + file)) {
                image.resize(process.cwd() + config.image_store + '/original/' + file, targetPath + file, imageSize.width, imageSize.height).then((a) => {
                    currentPos--;
                    console.log('read_6_resize', currentPos, imageSize.name, 'RESIZE', file);
                }).catch((error) => {
                    console.log(error);
                    process.exit(-1);
                });
            } else {
                currentPos--;
                console.log('read_6_resize', currentPos, imageSize.name, 'SKIP', file);
            }
        });
    });
});

