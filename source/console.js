var yargs = require('yargs');

yargs.command('add', 'Add new session', {}, (argv) => {
    console.log('add');
});
yargs.command('list', 'Add new session', {}, (argv) => {
    console.log('list');
});
yargs.help().argv;
