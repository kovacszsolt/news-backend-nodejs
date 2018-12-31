const Jimp = require('jimp');
const sharp = require('sharp');
const createImage = (filename, width, height, background) => {
    return Jimp.create(width, height, background, (err, image) => {
        image.write(filename); // save


    });
}

const createImageWithText = (filename, width, height, background, text) => {
    return new Promise((resolve, reject) => {
        Jimp.create(width, height, background, (err, image) => {
            Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then((font) => { // load font from .fnt file
                let totalWidth = measureText(font, text);
                image.print(font, Math.floor(width / 2 - totalWidth / 2), Math.floor(height / 2 - 32), text);
                image.write(filename); // save
                resolve(true);
            }).catch((e) => {
                reject(e);
            });
        });
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

const measureText = (font, text) => {
    var x = 0;
    for (var i = 0; i < text.length; i++) {
        if (font.chars[text[i]]) {
            x += font.chars[text[i]].xoffset
                + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                + (font.chars[text[i]].xadvance || 0);
        }
    }
    return x;
};

module.exports = {
    createImage,
    createImageWithText,
    resize
};
