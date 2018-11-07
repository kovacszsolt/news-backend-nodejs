/**
 * Web End Point for Twitter Tweet
 */

const tweet = require('./twitter_tweet');
const router = (app, upload) => {

    app.get('/twitter/tweet/list/', function (req, res) {
        tweet.list().then((records) => {
            res.send(records);
        })
    });

    app.get('/twitter/tag/:slug?', function (req, res) {
        category.find({slug: req.params.slug}).then((categoryResult) => {

            if (categoryResult.length === 1) {
                const categordId = categoryResult[0]._id;
                tweet.find({twitter_category: categordId}).then((twitterResult) => {
                    console.log(twitterResult);
                    process.exit(0);
                }).catch((err) => {
                    console.log(err);
                    process.exit(0);

                });
            } else {
                console.log(categoryResult);
                process.exit(0);
            }


        }).catch((err) => {
            console.log(err);
        });
    });

    app.get('/twitter/tweet/teszt/', function (req, res) {
        res.send({data: 'hello twitter tweet teszt'});
    });

}
module.exports = {
    router
}