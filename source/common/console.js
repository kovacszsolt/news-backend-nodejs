/**
 * Common variables for Console App
 */

const console = require('yargs');

class _options {
    constructor() {
        this.idOptions = {
            describe: 'ID',
            demand: false,
            alias: 'i'
        };

        this.ipOptions = {
            describe: 'IP address',
            demand: false,
            alias: 'ip'
        };

        this.createDateOptions = {
            describe: 'Create Date',
            demand: false,
            alias: 'crda'
        };

        this.nameOptions = {
            describe: 'Name',
            demand: false,
            alias: 'n'
        };

        this.passwordOptions = {
            describe: 'Password',
            demand: false,
            alias: 'pwd'
        };

        this.emailOptions = {
            describe: 'e-mail',
            demand: false,
            alias: 'em'
        };

        this.userIdOptions = {
            describe: 'user ID',
            demand: false,
            alias: 'uid'
        };

        this.titleOptions = {
            describe: 'Title',
            demand: false,
            alias: 'ti'
        };

        this.introOptions = {
            describe: 'Intro',
            demand: false,
            alias: 'in'
        };

        this.contentOptions = {
            describe: 'Content',
            demand: false,
            alias: 'con'
        };

        this.hostOptions = {
            describe: 'Host',
            demand: false,
            alias: 'ho'
        };

        this.feedUrlOptions = {
            describe: 'Feed URL',
            demand: false,
            alias: 'furl'
        };

        this.urlOptions = {
            describe: 'URL',
            demand: false,
            alias: 'url'
        };

        this.siteIdOptions = {
            describe: 'Site ID',
            demand: false,
            alias: 'sid'
        };

        this.categorylistOptions = {
            describe: 'Category ID List',
            demand: false,
            alias: 'cidl'
        };

        this.categoryIdOptions = {
            describe: 'Category ID',
            demand: false,
            alias: 'cid'
        };

        this.twitterIdOptions = {
            describe: 'Twitter ID',
            demand: false,
            alias: 'twiid'
        };

        this.imageUrlOptions = {
            describe: 'Image Url',
            demand: false,
            alias: 'iurl'
        };

    }
}

const options = new _options();


module.exports = {
    console,
    options
};