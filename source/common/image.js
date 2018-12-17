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
    });
}


module.exports = {
    resize
};