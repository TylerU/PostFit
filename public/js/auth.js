var $ = require('jquery-browserify');
var Promise = require('bluebird');

var AuthService = (function(){
    var route = './api/';
    var authToken = null;

    function attemptLocalStorageRetrieval() {
        if(localStorage.getItem('postfit-auth-token')) {
            authToken = localStorage.getItem('postfit-auth-token');
        }
    }
    function storeInLocalStorage(token) {
        localStorage.setItem('postfit-auth-token', token);
    }
    function removeLocalStorage(token) {
        localStorage.removeItem('postfit-auth-token');
    }
    return {
        signIn: function(username, password, remember) {
            remember = true;
            return Promise.resolve($.post('./api/login', {
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

