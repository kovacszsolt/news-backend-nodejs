const meta = require('../common/meta');
const url = process.argv[2];
meta.getMetaFromUrl(url, []).then((a) => {
    console.log('a',a);
}).catch((e) => {
    console.log(e);
});
