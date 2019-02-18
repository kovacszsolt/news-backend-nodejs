const config = require('../common/config');
const util = require('../common/util');
const image = require('../common/image');
const fs = require('fs-extra');
const filesOriginal = fs.readdirSync(process.cwd() + config.image_store + '/original/');
let _count = config.image_sizes.length;
config.image_sizes.forEach((imageSize) => {
    const sizePath = process.cwd() + config.image_store + '/' + imageSize.name + '/';
    fs.ensureDirSync(sizePath);
    const filesSize = fs.readdirSync(sizePath);
    const newSizeFiles = util.arrayDiff(filesOriginal, filesSize);
    Promise.all(
        newSizeFiles.map(newSizeFile =>
            image.resize(process.cwd() + config.image_store + '/original/' + newSizeFile, sizePath + newSizeFile, imageSize.width, imageSize.height)
        )).then((qq) => {
        _count--;
        console.log(_count);
    })
});