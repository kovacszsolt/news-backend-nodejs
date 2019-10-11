const fs = require('fs-extra');
module.exports = class webClass {


    constructor(tweetCollection, statusCollection, config) {
        this.pageSize = 2;
        this.tweetCollection = tweetCollection;
        this.statusCollection = statusCollection;
        this.config = config;
    }

    slug(tweetSlug) {
        console.log('tweetSlug',tweetSlug);
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({'meta.slug': tweetSlug}).toArray(function (err, tweetList) {
                resolve(tweetList[0]);
            });
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({status: 3}).toArray(function (err, tweetList) {
                resolve(tweetList);
            });
        });
    }

    position(positionNumber) {
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({position: Number(positionNumber)}).toArray(function (err, tweetList) {
                resolve(tweetList);
            });
        });
    }

    positionList() {
        return new Promise((resolve, reject) => {
            this.statusCollection.find().toArray(function (err, tweetList) {
                resolve(tweetList);
            });
        });
    }

    positionListGreaterThan(positionNumber) {
        return new Promise((resolve, reject) => {
            this.tweetCollection.find({position: {$gt: Number(positionNumber)}}).toArray(function (err, tweetList) {
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

    listPage(pageNumber, pageSize) {
        return new Promise((resolve, reject) => {
            this.tweetCollection.count({status: 3}, (err, data) => {
                const _total_elements = data;
                const _total_pages = (_total_elements === 0 ? 0 : Math.ceil(_total_elements / pageSize));
                this.tweetCollection.find({status: 3}).limit(parseInt(pageSize)).skip(pageSize * (parseInt(pageNumber) - 1)).toArray(function (err, tweetList) {
                    const _response = {
                        empty: (_total_elements == 0),
                        first: (pageNumber == 1),
                        last: (_total_pages == pageNumber),
                        number_of_element: pageSize,
                        size: pageSize,
                        offset: pageSize,
                        total_elements: _total_elements,
                        total_pages: _total_pages,
                        content: tweetList
                    };
                    resolve(_response);
                });
            });
        });
    }

    tag(tag, pageNumber, pageSize) {
        console.log('tag', tag);
        const _query = {
            tags: { $in: [tag] }
        };

        return new Promise((resolve, reject) => {
            this.tweetCollection.count(_query, (err, data) => {
                const _total_elements = data;
                const _total_pages = (_total_elements === 0 ? 0 : Math.ceil(_total_elements / pageSize));
                this.tweetCollection.find(_query).limit(parseInt(pageSize)).skip(pageSize * (parseInt(pageNumber) - 1)).toArray((err, tweetList) => {
                    const _response = {
                        empty: (_total_elements == 0),
                        first: (pageNumber == 1),
                        last: (_total_pages == pageNumber),
                        number_of_element: pageSize,
                        size: pageSize,
                        offset: pageSize,
                        total_elements: _total_elements,
                        total_pages: _total_pages,
                        content: tweetList
                    };
                    resolve(_response);
                });
            });
        });
    }

    search(text, pageNumber, pageSize) {
        const _query = {
            $or: [
                {"meta.title": new RegExp(text, "i")},
                {"meta.description": new RegExp(text, "i")}
            ]
        };
        return new Promise((resolve, reject) => {
            this.tweetCollection.count(_query, (err, data) => {
                const _total_elements = data;
                const _total_pages = (_total_elements === 0 ? 0 : Math.ceil(_total_elements / pageSize));
                this.tweetCollection.find(_query).limit(parseInt(pageSize)).skip(pageSize * (parseInt(pageNumber) - 1)).toArray((err, tweetList) => {
                    const _response = {
                        empty: (_total_elements == 0),
                        first: (pageNumber == 1),
                        last: (_total_pages == pageNumber),
                        number_of_element: pageSize,
                        size: pageSize,
                        offset: pageSize,
                        total_elements: _total_elements,
                        total_pages: _total_pages,
                        content: tweetList
                    };
                    resolve(_response);
                });
            });
        });
    }
}

