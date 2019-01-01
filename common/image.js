const sharp = require('sharp');
const fs = require('fs-extra');
const createImage = (filename, width, height, background) => {
    return Jimp.create(width, height, background, (err, image) => {
        image.write(filename); // save


    });
}
const createSvgWithText = (filename, width, height, background, text) => {
    return new Promise((resolve, reject) => {
        const content = '<svg xmlns="http://www.w3.org/2000/svg" height="' + height + '" width="' + width + '" style="background-color: ' + background + '">\n' +
            '    <text text-anchor="middle" x="' + width / 2 + '" y="' + height / 2 + '" fill="white" style="font-size:40px">' + text + '</text>\n' +
            '</svg>\n';
        fs.writeFile(filename, content, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });

}

const createImageWithText = (filename, width, height, background, text) => {
    return createSvgWithText(filename + '.tmp', width, height, background, text).then((a) => {
        return svgToJpg(filename + '.tmp', filename).then((b) => {
            fs.removeSync(filename + '.tmp');
            return b;
        });
    }).catch((e) => {
        return e;
    });
}

const svgToJpg = (source, target) => {
    return sharp(source)
        .jpeg({quality: 80})
        .flatten({
            background: '#FFA500'
        })
        //.embed()
        .toFile(target)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err;
        });
}

const resize = async (source, target, width, height) => {
    return sharp(source)
        .resize(width, height)
        .toFile(target)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err;
        });
}

module.exports = {
    createImageWithText,
    resize
};
