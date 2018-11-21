/**
 * Console End Point for Twitter Tweet
 * @type {{console, options}|*}
 */
const yargs = require('../common/console');
const settings = require('./settings');
const util = require('util');
yargs.options.titleOptions.demand = true;

yargs.console.command('updatetime', 'List Update time', {}, (argv) => {
    console.log(settings.updateTime());
    /*
    settings.updateTime().then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}))
    })
    */
});

yargs.console.command('list', 'List all Settings', {}, (argv) => {
    settings.list().then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}))
    })
});

yargs.console.help().argv;
