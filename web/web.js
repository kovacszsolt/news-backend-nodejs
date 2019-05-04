module.exports = class webClass {

    constructor(tweetCollection, config) {
        this.tweetCollection = tweetCollection;
        this.config = config;
    }

    list() {
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({status: 3}).toArray(function (err, tweetList) {
                resolve(tweetList);
            });
        });
    }

    findTagImage(tag) {
        return new Promise((resolve, reject) => {
            const fileName = process.cwd() + this.config.image_store + '/tag/' + tag + '.jpg';
            if (fs.existsSync(fileName)) {
                const requestFileName = this.config.image_store + '/tag/' + tag + '.jpg';
                resolve(requestFileName);
            } else {
                resolve(this.config.default_image);
            }
        });
    }

    search(text) {
        return new Promise((resolve, reject) => {
            tweetCollection.find(
                {
                    $or: [
                        {"meta.title": new RegExp(text, "i")},
                        {"meta.description": new RegExp(text, "i")}
                    ]
                }
            ).toArray((err, tweetList) => {
                resolve(tweetList);
            });
        });
    }

    findTweetImage(size, slug, extension) {
        return new Promise((resolve, reject) => {
            const fileName = process.cwd() + this.config.image_store + '/' + size + '/' + slug + '.' + extension;
            if (fs.existsSync(fileName)) {
                resolve(this.config.image_store + '/' + size + '/' + slug + '.' + extension);
            } else {
                console.log(fileName, 'ERROR', 'NOFILE');
                resolve(this.config.default_image);
            }
        });
    }
}

