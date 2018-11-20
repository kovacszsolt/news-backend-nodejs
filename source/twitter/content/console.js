/**
 * Console End Point for Twitter Content
 * @type {{console, options}|*}
 */

const yargs = require('../../common/console');
const twitter = require('./private');
const util = require('util');
yargs.options.titleOptions.demand = true;
yargs.options.urlOptions.demand = true;
yargs.options.contentOptions.demand = true;

yargs.console.command('add', 'Add Twitter Content', {
    title: yargs.options.titleOptions,
    url: yargs.options.urlOptions,
    content: yargs.options.contentOptions,
    imageurl: yargs.options.imageUrlOptions
}, (argv) => {
    twitter.add(argv.title, argv.url, argv.content, argv.imageurl).then((addResult) => {
        console.log(addResult);
    }).catch((addError) => {
        util.exit(addError);
    })
});

yargs.options.idOptions.demand = true;
yargs.console.command('update', 'Updarte Twitter Content', {
    id: yargs.options.idOptions,
    title: yargs.options.titleOptions,
    url: yargs.options.urlOptions,
    content: yargs.options.contentOptions,
    imageurl: yargs.options.imageUrlOptions
}, (argv) => {
    twitter.update(argv.id, argv.title, argv.url, argv.content, argv.imageurl).then((addResult) => {
        console.log(addResult);
    }).catch((addError) => {
        util.exit(addError);
    })
});

yargs.console.command('remove', 'Remove Twitter Content', {
    id: yargs.options.idOptions
}, (argv) => {
    twitter.remove(argv.id).then((addResult) => {
        console.log(addResult);
    }).catch((addError) => {
        util.exit(addError);
    })
});

yargs.console.command('list', 'List all Twitter Content', {}, (argv) => {
    twitter.list().then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}))
    })
});

yargs.console.help().argv;
