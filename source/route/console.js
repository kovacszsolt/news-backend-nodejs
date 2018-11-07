const yargs = require('../common/console');
const route = require('./private');
const util = require('util');

yargs.console.command('list', 'List all Route', {}, (argv) => {
    route.list().then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}));
        process.exit(0);
    })
});

yargs.console.command('findurl', 'find URL', {
    url: yargs.options.urlOptions
}, (argv) => {
    route.findSlug(argv.url).then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}));
        process.exit(0);
    })
});

yargs.console.help().argv;
