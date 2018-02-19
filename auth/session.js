var crypto = require('crypto');

const session = {};

session.generateKey = (seed) => {
    var sha = crypto.createHash('sha512');
    var seed = Math.random().toString() + seed;
    console.log("Random", seed);
    sha.update(seed);
    return sha.digest('hex');
}

session.generateUniqueKey = () => {
    
}

module.exports = session;