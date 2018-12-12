const util = require('./util');

const fs = require('fs');
const ROOT = process.cwd() + '/';
const config = () => {
    if (fs.existsSync(ROOT + 'config.json')) {
        return require(ROOT + 'config.json');
    } else {
        const _config = require(ROOT + 'config.example.json');
        _config.port = getParam('PORT');
        _config.image_store = getParam('IMAGE_STORE');
        _config.mongo_server = getParam('MONGOSERVER');
        _config.allow_origin = getParam('ALLOWORIGIN');
        _config.twitter_consumer_key = getParam('TWITTERCONSUMERKEY');
        _config.twitter_consumer_secret = getParam('TWITTERCONSUMERSECRET');
        _config.twitter_access_token_key = getParam('TWITTERACCESSTOKENKEY');
        _config.twitter_access_token_secret = getParam('TWITTERACCESSTOKENSECRET');
        _config.twitter_screen_name = getParam('TWITTERSCREENNAME');
        Object.keys(_config).map((_configName) => {
            if (_config[_configName] === '') {
                util.exit('Config ERROR');
            }
        });
        return _config;
    }
}

const getParam = (__name, __default = '') => {
    let __return = __default;
    if (process.env[__name] !== undefined) {
        __return = process.env[__name];
    }
    return __return;
}

module.exports = config();