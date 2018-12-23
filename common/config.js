const util = require('./util');

const fs = require('fs');
const ROOT = process.cwd() + '/';
const config = () => {
    if (fs.existsSync(ROOT + 'config.json')) {
        return require(ROOT + 'config.json');
    } else {
        const _config = require(ROOT + 'config.example.json');
        _config.port = getParam('PORT');
        _config.port_ssr = getParam('PORT_SSR');
        _config.image_store = getParam('IMAGE_STORE');
        _config.sitemap_domain = getParam('SITEMAP_DOMAIN');
        _config.default_image = getParam('DEFAULT_IMAGE');
        _config.mongo_server = getParam('MONGOSERVER');
        _config.mongo_database = getParam('MONGODATABASE');
        _config.allow_origin = getParam('ALLOWORIGIN');
        _config.twitter_consumer_key = getParam('TWITTERCONSUMERKEY');
        _config.twitter_consumer_secret = getParam('TWITTERCONSUMERSECRET');
        _config.twitter_access_token_key = getParam('TWITTERACCESSTOKENKEY');
        _config.twitter_access_token_secret = getParam('TWITTERACCESSTOKENSECRET');
        _config.twitter_screen_name = getParam('TWITTERSCREENNAME');
        _config.twitter_excepotion = JSON.parse(getParam('TWITTEREXCEPTION'));
        _config.read_count = getParam('READ_COUNT');
        _config.image_sizes = JSON.parse(getParam('IMAGE_SIZES'));

        Object.keys(_config).map((_configName) => {
            if (_config[_configName] === '') {

                util.exit('Config ERROR >>>> ' + _configName);
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