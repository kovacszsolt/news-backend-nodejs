/**
 * Console End Point for Twitter Tweet
 * @type {{console, options}|*}
 */
const mongoose = require('mongoose');
const yargs = require('../../common/console');
const twitter = require('./private');
const util = require('util');
yargs.options.titleOptions.demand = true;

yargs.console.command('findcategoryid', 'List Category by id TWITTER', {
    categoryid: yargs.options.categoryIdOptions
}, (argv) => {
    twitter.findCategory(mongoose.Types.ObjectId(argv.categoryid).then((findCategoryResult) => {
        console.log(findCategoryResult);
        process.exit(0);
    }).catch((findCategoryError) => {
        util.exit(findCategoryError);
    });
});

yargs.console.command('findcategory', 'List Category TWITTER', {
    slug: yargs.options.twitterIdOptions
}, (argv) => {
    category.find({slug: argv.slug}).then((categoryResult) => {

        if (categoryResult.length === 1) {
            const categordId = categoryResult[0]._id;
            twitter.find({twitter_category: categordId}).then((twitterResult) => {
                console.log(twitterResult);
                process.exit(0);
            }).catch((twitterError) => {
                util.exit(twitterError);

            });
        } else {
            console.log(categoryResult);
            process.exit(0);
        }


    }).catch((categoryError) => {
        util.exit(categoryError);
    });
});

yargs.console.command('list', 'List all Tweet', {}, (argv) => {
    twitter.list().then((listResult) => {
        console.log(util.inspect(listResult, {showHidden: false, depth: null}))
    })
});

yargs.console.help().argv;
