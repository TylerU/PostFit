var bookshelf = require('../database').bookshelf;
var Promise = require('bluebird');
var cryptoHelper = require('../lib/cryptoHelper');

var User = bookshelf.Model.extend({
    tableName: 'user',

    save: Promise.method(function() {
        if(this.hasChanged('password') || this.isNew()) {
            return cryptoHelper.saltAndHash(this.get('password')).then(function(hashed) {
                this.set('hashedPassword', hashed);
                this.unset('password');
                console.log(this.toJSON());
                return bookshelf.Model.prototype.save.apply(this);
            }.bind(this));
        }
        else {
            return bookshelf.Model.prototype.save.apply(this);
        }
    })
}, {

    attemptLogin: Promise.method(function(username, password) { // Wraps in a promise that takes care of errors and such. Cool.
        if (!username || !password) throw new Error('Username and password are both required');

        return new this({username: username.trim()}).fetch({require: true}).then(function(user) {
            return cryptoHelper.compareAsync(user.get('hashedPassword'), password).then(function(match) {
                if(!match) return null;
                return user;
            });
        });
    })


});


module.exports = User;
