const sharp = require('sharp');

const resize = (sourceFile, destionationFile, width) => {
    return new Promise((resolve, reject) => {
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
    });
}


module.exports = {
    resize
};