const db = require('./private');

const resultError = {
    OK: 0
}

const result = () => {
    return {
        status: resultError.OK,
        result: {}
    };
}

async function purge() {
    await db.purge();
}

module.exports = {
    resultError,
    purge
}
