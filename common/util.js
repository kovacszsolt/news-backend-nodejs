const request = require('request');
const fs = require('fs-extra');
const exit = (__message, __exit = true) => {
    console.log('-------------------------');
    console.log('-------------------------');
    console.log(__message);
    console.log('-------------------------');
    console.log('-------------------------');
    if (__exit) {
        process.exit(-1);
    }
}

const getHastagsFromText = (str) => {
    const regex = /(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)/g;
    let _regexResult;
    const _return = [];
    while ((_regexResult = regex.exec(str)) !== null) {
        if (_regexResult.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        _regexResult.forEach((match, index) => {
            if (index === 1) {
                _return.push(match.toLowerCase());
            }
        });
    }
    return _return;
}

const arrayDiff = (array1, array2) => {
    return Array.from(new Set(
        [...new Set(array1)].filter(x => !new Set(array2).has(x))));
}

const getUrlFromText = (str) => {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const _regex = regex.exec(str);
    return (_regex === null) ? '' : _regex[0];
}

const rmDirectory = (dirPath) => {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};


const getFileName = (file) => {
    if (file.indexOf('?') !== -1) {
        file = file.substring(0, file.indexOf('?'));
    }
    file = file.split('.');
    file.pop();
    return file.join('.');
}

const getFileExtension = (file) => {
    if (file.indexOf('?') !== -1) {
        file = file.substring(0, file.indexOf('?'));
    }
    file = file.split('.');
    return file.pop();
}

const downloadFromURL = (source, target) => {
    return new Promise((resolve, reject) => {
        console.log('source', source);
        let url = source;
        if (url !== undefined) {
            if (url.substring(0, 2) === '//') {
                url = 'http:' + url;
            }
        } else {
            //url = '';
            console.log('error', source);
            reject({url: source});
        }
        request(url, {encoding: 'binary'}, (error, response, body) => {
            if (error === null) {
                fs.writeFile(target, body, 'binary', function (err) {
                    if (err === null) {
                        resolve(true);
                    } else {
                        reject(err);
                        console.log('write error', err);
                    }
                });
            } else {
                reject(error);
                console.log('request error', error);
            }
        });
    });
}


module.exports = {
    getFileExtension,
    getHastagsFromText,
    getUrlFromText,
    rmDirectory,
    downloadFromURL,
    exit,
    arrayDiff,
    getFileName
};
