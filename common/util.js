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
        _regexResult.map((match, index) => {
            if (index === 1) {
                _return.push(match.toLowerCase());
            }
        });
    }
    return _return;
}

const getUrlFromText = (str) => {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const _regex = regex.exec(str);
    return (_regex === null) ? '' : _regex[0];
}

rmDirectory = (dirPath) => {
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


module.exports = {
    getHastagsFromText,
    getUrlFromText,
    rmDirectory,
    exit
};