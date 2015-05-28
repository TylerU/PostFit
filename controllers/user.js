var _ = require('../lib/underscore');
var User = require('../models/user');
var Promise = require('bluebird');
var jwt = require('jsonwebtoken');

var secretToken = require('../config').secret;

// TODO - convert to asynchronous hashing

module.exports.login = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
        return res.sendStatus(401);
    }

    User.attemptLogin(username, password).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }

        var token = jwt.sign(user.toJSON(), secretToken, { expiresInMinutes: 1440 });

        return res.json({
            success: true,
            token:token
        });
    }, function(error) {
        return res.sendStatus(401);
    });
};

module.exports.logout = function(req, res) {
    return res.json({success: true});
};

// TODO - fix this
module.exports.createAccount = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var school = req.body.school || '';

    new User({
        username: username,
        password: password,
        school_id: school
    }).save().then(function(user) {
        res.json({
            success: true,
            message: 'User Created',
            user: user
        });
        }, function(error) {
            res.json({success: false, err: error});
        });
};