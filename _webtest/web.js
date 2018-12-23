const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send({data: 'hello  web test world'});
});

app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
