var express = require('express');
var bodyParser = require('body-parser');
//var passport = require('passport');
var athleteController = require('./controllers/athlete');
var statController = require('./controllers/stats');
var teamController = require('./controllers/team');
var userController = require('./controllers/user');
var _ = require('underscore');

var jwt = require('express-jwt');
var auth = require('./controllers/auth');

var Team = require('./models/team');
var knex = require('./database').knex;
// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true,
}));



// Create our Express router
var router = express.Router();
var secret = require('./config').secret;

router.use(jwt({ secret: secret}).unless({path: ['/api/login']}));

router.route('/user')
    .get(auth.atLeastAthlete, auth.getUser);

router.route('/:school_id/stats/:athlete_id')
    // Get stats summary for a given athlete
    .get(auth.atLeastAthlete, statController.getStats);


router.route('/:school_id/stats/:stat_id')
    // Delete a stat entry
    .delete(auth.atLeastCoach, statController.deleteStat);


router.route('/:school_id/stats')
    // Add a new single stat
    .post(auth.atLeastCoach, statController.postStat);


router.route('/:school_id/statsBulk')
    // Add a bunch of stats
    .post(auth.atLeastCoach, statController.postStats);

router.route('/:school_id/statTypes')
    // Create a new stat type
    .post(auth.atLeastCoach, statController.postStatType)
    // Get all stat types
    .get(auth.atLeastCoach, statController.getStatTypes);

//router.route('/:school_id/statTypes/:statType_id')
    // Remove a stat type
    //.delete(auth.atLeastCoach, statController.deleteStatType);


router.route('/:school_id/athletes')
    // Get all athletes at a given school
    .get(auth.atLeastCoach, athleteController.getAthletes)
    // Create a new athlete
    .post(auth.atLeastCoach, athleteController.postAthlete);

router.route('/:school_id/athletes/:athlete_id')
    // Get athlete information
    .get(auth.atLeastAthlete, athleteController.getAthlete)
    // Update an athlete's basic info
    .put(auth.atLeastCoach, athleteController.putAthlete);

router.route('/:school_id/teams')
    // Get all teams at a school
    .get(auth.atLeastCoach, teamController.getTeams)
    // Create a new team
    .post(auth.atLeastDirector, teamController.postTeam);

router.route('/:school_id/teams/:team_id')
    // Fetch a team by id
    .get(auth.atLeastCoach, auth.teamIsAccessible, teamController.getTeam)
    // Update a team
    .put(auth.atLeastCoach, auth.teamIsAccessible, teamController.putTeam);
    //// Remove a team forever
    //.delete(auth.atLeastDirector, teamController.deleteTeam);

router.route('/:school_id/teams/aggregateStats/:team_id')
    // Get team summary graph info
    .get(auth.atLeastCoach, auth.teamIsAccessible, teamController.getTeamSummary);

router.route('/:school_id/teams/memberStats/:team_id')
    // Get team member table values
    .get(auth.atLeastCoach, auth.teamIsAccessible, teamController.getTeamMembersStats);

router.route('/login')
    // Login
    .post(userController.login);

// TODO better error handling
//router.use(function(err, req, res, next) {
//    var errorObj = {
//        success: false,
//        error: err
//    };
//
//    if(err.name == "UnauthorizedError") {
//        return res.status(401).json(errorObj)
//    }
//
//    res.status(500).json(errorObj);
//});


// Register all our routers with /api
app.use('/api', router);

app.use('/public', express.static('public'));
app.use('/public', function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
});

app.get('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname+'/public' });
});

// Start the server
app.listen(3000);


