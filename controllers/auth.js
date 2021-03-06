var Team = require('../models/team');
var _ = require('underscore');

module.exports.atLeastDirector = function(req, res, next) {
    var schoolId = req.params.school_id;
    if(req.user.god) {
        return next();
    }

    if(req.user.school_id != schoolId) {
        return next({
            status: 403,
            message: 'Insufficient Permissions. Wrong school.'
        });
    }

    if(req.user.role == 'director') {
        return next();
    }
    return next({
        status: 403,
        message: 'Insufficient Permissions. Directors only.'
    });
};

module.exports.atLeastGod = function(req, res, next) {
    if(req.user.god) {
        return next();
    }

    return next({
        status: 403,
        message: 'Insufficient Permissions. Gods only.'
    });
};


module.exports.atLeastCoach = function(req, res, next) {
    var schoolId = req.params.school_id;
    if(req.user.god) {
        return next();
    }

    if(req.user.school_id != schoolId) {
        return next({
            status: 403,
            message: 'Insufficient Permissions. Wrong school.'
        });
    }

    if(req.user.role == 'director' || req.user.role == 'coach') {
        return next();
    }

    return next({
        status: 403,
        message: 'Insufficient Permissions. Directors and coaches only.'
    });
};

module.exports.atLeastAthlete = function(req, res, next) {
    var schoolId = req.params.school_id;
    if(req.user.god) {
        return next();
    }

    if(req.user.school_id != schoolId) {
        return next({
            status: 403,
            message: 'Insufficient Permissions. Wrong school.'
        });
    }

    return next();
};

module.exports.teamIsAccessible = function(req, res, next) {
    var schoolId = req.params.school_id;
    var teamId = req.params.team_id;

    new Team({id: teamId, school_id: schoolId}).fetch().then(function(team) {
        if(team) return next();
        return next({
            message: "Access to team denied"
        });
    }, function(err) {
        return next(err);
    });
};

module.exports.getUser = function(req, res) {
    if(req.user) {
        res.send(_.pick(req.user, 'school_id', 'role', 'god'))
    }
    else {
        res.send(null);
    }
};