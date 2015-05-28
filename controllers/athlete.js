// Load required packages
var Athlete = require('../models/athlete');
var _ = require('../lib/underscore');

// TODO - Athlete belongs to which school?
exports.postAthlete = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    var athlete = {};
    athlete.firstName = req.body.firstName;
    athlete.lastName = req.body.lastName;
    athlete.year = req.body.year;
    athlete.birthDate = new Date(req.body.birthDate);
    athlete.gender = req.body.gender;
    athlete.school_id = schoolId;

    Athlete.forge(athlete).save().then(function(athlete) {
        res.json({ message: 'Athlete created!', data: athlete });
    }).catch(function(err) {
        res.send(err);
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

    new Athlete({
        school_id: schoolId,
        id: req.params.athlete_id}).fetch().then(function(athlete) {
        res.json(athlete);
    }).catch(function(err) {
        res.send(err);
    });
};

// Create endpoint /api/athletes/:athlete_id for PUT
exports.putAthlete = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    var id = req.params.athlete_id;

    // TODO: Validate
    var newObj = _.pick(req.body, 'firstName', 'lastName', 'year', 'birthDate', 'height', 'teams', 'gender', 'sharing');
    new Athlete({
        school_id: schoolId,
        id: id}).save(newObj).then(function(result) {
            res.json({ message: 'updated', result: result });
    }, function(err) {
        res.send(err);
    })
};