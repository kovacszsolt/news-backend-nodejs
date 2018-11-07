const config = require('../common/config');
const twitterContent = require('./content/private');
const twitter = require('./tweet/private');
const category = require('./category/private');
const route=require('../route/private');


Promise.all([category.purge(),twitter.purge(),twitterContent.purge(),route.purge()]).then((result)=>{
   console.log('OK');
   process.exit(0);
});