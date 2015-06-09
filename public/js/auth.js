var $ = require('jquery-browserify');
var Promise = require('bluebird');
var moment = require('moment');
var config = require('../../config');

var AuthService = (function(){
    var route = './api/';
    var authToken = null;

    function attemptLocalStorageRetrieval() {
        if(localStorage.getItem('postfit-auth-token')) {
            authToken = localStorage.getItem('postfit-auth-token');
            var start = moment(new Date(localStorage.getItem('postfit-auth-token-created')));
            var now = moment();
            var diff = moment.duration(now.diff(start)).asMinutes();
            if(diff > config.tokenLifeMinutes) {
                // Expired
                authToken = null;
                removeLocalStorage();
            }
        }
    }

    function storeInLocalStorage(token) {
        localStorage.setItem('postfit-auth-token', token);
        localStorage.setItem('postfit-auth-token-created', new Date());
    }

    function removeLocalStorage() {
        localStorage.removeItem('postfit-auth-token');
        localStorage.removeItem('postfit-auth-token-created');
    }

    return {
        signIn: function(username, password, remember) {
            remember = true;
            return Promise.resolve($.post('/api/login', {
                username: username,
                password: password
            })).then(function(response) {
                if(response && response.success && response.token) {
                    authToken = response.token;
                    if(remember) storeInLocalStorage(authToken);
                    return true;
                }
                throw response;
            });
        },
        signOut: function() {
            authToken = null;
            removeLocalStorage();
        },
        isLoggedIn: function() {
            if(!authToken) {
                attemptLocalStorageRetrieval();
            }
            return !!authToken;
        },
        getHeaders: function() {
            if(!this.isLoggedIn()) {
                return null;
            }

            return {
                "Authorization": 'Bearer ' + authToken
            };
        }
    };
})();

module.exports = AuthService;
window.Auth = AuthService;

