// Load required packages
var Athlete = require('../models/athlete');
var _ = require('underscore');
var Checkit = require('checkit');
var Team = require('../models/team');
var Promise = require('bluebird');

// TODO - Athlete belongs to which school?
exports.postAthlete = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    var athlete = {};
    athlete.firstName = req.body.firstName;
    athlete.lastName = req.body.lastName;
    athlete.year = req.body.year;
    athlete.birthDate = req.body.birthDate ? Date.parse(req.body.birthDate) : null;
    athlete.gender = req.body.gender;
    athlete.school_id = schoolId;


    var rules = new Checkit({
        firstName: 'required',
        lastName: 'required',
        year: ['required', 'natural'],
        birthDate: [{
            rule: 'natural',
            message: 'The birthDate must be a valid Date.'
        }],
        gender: ['required', 'alpha']
    });

    rules
        .run(athlete)
        .then(function() {
            if(athlete.birthDate)
              athlete.birthDate = new Date(athlete.birthDate);
            else
              delete athlete.birthDate;

            return Athlete.forge(athlete).save();
        }).then(function(createdAthlete){
            createdAthlete = createdAthlete.toJSON();
            if(req.body.teams) {
                createdAthlete.teams = req.body.teams;

                var all = _.map(req.body.teams, function(teamId) {
                    return new Team({id: teamId}).addAthleteAndSave(createdAthlete.id);
                });

                return Promise.all(all).then(function() {
                    return createdAthlete;
                });
            }
            else {
                return createdAthlete;
            }
        }).then(function(createdAthlete) {
            res.json({success: true, data: createdAthlete});
        }, function(error) {
            res.json({success: false, errors: error});
        }).catch(Checkit.Error, function(err) {
            res.send({
                success: false,
                errors: err
            });
        });
};

// TODO - which school to query for?
exports.getAthletes = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    Athlete.query({where: {school_id: schoolId}}).fetchAll().then(function(all) {
        res.json(all.toJSON());
    }).catch(function(err) {
        res.send(err);
    });
};

// Create endpoint /api/athletes/:athlete_id for GET
exports.getAthlete = function(req, res) {
    var schoolId = parseInt(req.params.school_id);
    var result = {};

    new Athlete({
        school_id: schoolId,
        id: req.params.athlete_id
    }).fetch().then(function(athlete) {
            result.athlete = athlete.toJSON();
            return athlete.getTeams(true);
        }).then(function(teams) {
            result.athlete.teams = teams;
            res.json(result.athlete);
        }).catch(function(err) {
            res.send({success: false, error: err});
        });
};

// Create endpoint /api/athletes/:athlete_id for PUT
exports.putAthlete = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    var id = req.params.athlete_id;

    // TODO: Validate
    var newObj = _.pick(req.body, 'firstName', 'lastName', 'year', 'birthDate', 'gender');
    // Check for membership
    new Athlete({
        school_id: schoolId,
        id: id}).save(newObj).then(function(createdAthlete){
            createdAthlete = createdAthlete.toJSON();
            createdAthlete.teams = (req.body.teams || []).map(function(i) {return parseInt(i);});


            var all = _.map(req.body.teams, function(teamId) {
                return new Team({id: teamId}).addAthleteAndSave(createdAthlete.id);
            });

            all.push(new Athlete({id: createdAthlete.id}).getTeams().then(function(teams) {
                var toRemove = _.difference(teams, createdAthlete.teams);
                var allToRemove = _.map(toRemove, function(teamId) {
                    return new Team({id: teamId}).removeAthleteAndSave(createdAthlete.id);
                });
                return Promise.all(allToRemove);
            }));

            return Promise.all(all).then(function() {
                return createdAthlete;
            });

        }).then(function(createdAthlete) {
            res.json({success: true, data: createdAthlete});
        }, function(error) {
            res.json({success: false, errors: error});
        });
};