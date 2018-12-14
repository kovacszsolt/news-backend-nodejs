const sharp = require('sharp');
const fsextra = require('fs-extra');
const util = require('./util');
const gm = require('gm').subClass({imageMagick: true});
const resize = (sourceFile, destionationFile, width) => {
    const targetArray = destionationFile.split('/');
    fsextra.ensureDirSync(targetArray.slice(0, targetArray.length - 1).join('/'));
    return new Promise((resolve, reject) => {
        gm(sourceFile)
            .resize(width)
            .noProfile()
            .write(destionationFile, function (err) {
                if (!err) {
                    resolve(true);
                } else {
                    reject(err);
                }
            });
        /*
        sharp(sourceFile)
            .rotate()
            .resize(width)
            .toFile(destionationFile, (err, info) => {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
            */

    });
}


/*
const resize = (sourceFile, destionationFile, width) => {
    const targetArray = destionationFile.split('/');
    fsextra.ensureDirSync(targetArray.slice(0, targetArray.length - 1).join('/'));
    return new Promise((resolve, reject) => {
        console.log(util.getFileExtension(destionationFile));
        if (util.getFileExtension(destionationFile) === 'jpg') {
            sharp(sourceFile)
                .rotate()
                .resize(width)
                .toFile(destionationFile, (err, info) => {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(info);
                    }
                });
        } else {
            fsextra.copySync(sourceFile, destionationFile);
            resolve(true);
        }
    });
}
*/

module.exports = {
    resize
};