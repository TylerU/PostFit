var bcrypt = require('bcryptjs');
var Promise = require('bluebird');

module.exports = {
    saltAndHash: function(pass) {
        var genSalt = Promise.promisify(bcrypt.genSalt);
        var hash = Promise.promisify(bcrypt.hash);

        return genSalt().then(function(salt) {
            return hash(pass, salt).then(function(hash) {
                return hash;
            });
        });
    },

    compareAsync: function(hashed, notHashed) {
        var compareAsync = Promise.promisify(bcrypt.compare);

        return compareAsync(notHashed, hashed);
    }
};