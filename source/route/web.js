const route = require('./route');
const tweet = require('../twitter/tweet/private');
const router = (app, upload) => {

    app.get('/route/teszt/', function (req, res) {
        res.send({data: 'hello route teszt'});
    });

    app.get('/route/get/:slug?', function (req, res) {
        route.findSlug(req.params.slug).then((findSlugRequest) => {
            if ((findSlugRequest.status === 0) && ((findSlugRequest.result[0].twitter_category !== null))) {
                tweet.findCategory(findSlugRequest.result[0].twitter_category._id).then((findCategoryResult) => {
                    const findSlugRequestTmp = JSON.parse(JSON.stringify(findSlugRequest));
                    findSlugRequestTmp.result[0].twitter_category = findCategoryResult;
                    res.send(findSlugRequestTmp);
                });
            } else {
                // find category
                res.send(findSlugRequest);
            }
        });
    });
}
module.exports = {
    router
}