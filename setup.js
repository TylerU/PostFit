var knex = require('./database').knex;
var _ = require('underscore');
var Promise = require('bluebird');

var down = function(knex) {
    return knex.schema
        .dropTableIfExists('teammember')
        .dropTableIfExists('teammembersversion')
        .dropTableIfExists('teamstat')
        .dropTableIfExists('stat')
        .dropTableIfExists('stattype')
        .dropTableIfExists('user')
        .dropTableIfExists('athlete')
        .dropTableIfExists('team')
        .dropTableIfExists('school')
};

var up = function(knex) {
    return knex.schema.createTable('school', function (table) {
        table.increments();
        table.string('city');
        table.string('state');
        table.string('conference');
        table.string('name');
        table.integer('enrollment');
    }).createTable('team', function (table) {
        table.increments();
        table.string('name');
        table.integer('school_id').unsigned().references('school.id');
    }).createTable('user', function (table) {
        table.increments();
        table.string('username').unique();
        table.string('hashedPassword');
        table.boolean('god').defaultTo(false);
        table.integer('school_id').unsigned().references('school.id');
        table.enu('role', ['director', 'coach', 'athlete']).default('athlete');
    }).createTable('athlete', function (table) {
        table.increments();
        table.string('firstName');
        table.string('lastName');
        table.integer('year').unsigned();
        table.date('birthDate');
        table.string('gender');
        table.integer('school_id').unsigned().references('school.id');
    }).createTable('stattype', function (table) {
        table.increments();
        table.string('type'); /* Integer, Percentage, etc*/
        table.string('name'); /* Bench Press, High Jump, etc */
        table.string('label'); /* lbs, %, feet, etc */
        table.string('converter'); /* to_feet_inches, to meters, etc */
        table.integer('school_id').unsigned().references('school.id');
        table.enu('summaryType', ['latest', 'cumulative', 'largest']);
    }).createTable('stat', function (table) {
        table.increments();
        table.float('value');
        table.dateTime('time');
        table.integer('school_id').unsigned().references('school.id');
        table.integer('athlete_id').unsigned().references('athlete.id');
        table.integer('stattype_id').unsigned().references('stattype.id');
    }).createTable('teamstat', function(table) {
        var teamid = table.integer('team_id').unsigned();
        var stattypeid = table.integer('stattype_id').unsigned();
        table.primary(['team_id', 'stattype_id']);

        teamid.references('team.id');
        stattypeid.references('stattype.id');
    }).createTable('teammembersversion', function(table) {
        table.increments();
        table.integer('team_id').unsigned().references('team.id');
        table.integer('version').unsigned();
        table.dateTime('start').notNullable();
        table.dateTime('end');
    }).createTable('teammember', function(table) {
        var versionid = table.integer('version_id').unsigned();
        var athelteid = table.integer('athlete_id').unsigned();
        table.primary(['version_id', 'athlete_id']);
        versionid.references('teammembersversion.id');
        athelteid.references('athlete.id');
    })
};

function populateData(knex, name) {
    var arr = require('./demodata/' + name + 's');
    return Promise.reduce(arr, function(total, cur) {
        return knex.table(name).insert(cur).then(function(){return 0;});
    }, 0);
}

var createSchools = function(knex) {
    console.log("Creating schools");
    return populateData(knex, 'school');
};

var createUsers = function(knex) {
    console.log("Creating users");
    return populateData(knex, 'user');
};

var createTeams = function(knex) {
    console.log("Creating teams");
    return populateData(knex, 'team');
};

var createAthletes = function(knex) {
    console.log("Creating athletes");
    return populateData(knex, 'athlete');
};

var createStatTypes = function(knex) {
    console.log("Creating stattypes");
    return populateData(knex, 'stattype');
};

var createStats = function(knex) {
    console.log("Creating stats");
    return populateData(knex, 'stat');
};

var createTeamStats = function(knex) {
    console.log("Creating team stats");
    return populateData(knex, 'teamstat');
};

var createTeamMemberVersions = function(knex) {
    console.log("Creating team member versions");
    return populateData(knex, 'teammembersversion');
};

var createTeamMembers = function(knex) {
    console.log("Creating team members");
    return populateData(knex, 'teammember');
};

var populate = function(knex) {
    return createSchools(knex)
        .then(_.partial(createTeams, knex))
        .then(_.partial(createUsers, knex))
        .then(_.partial(createAthletes, knex))
        .then(_.partial(createStatTypes, knex))
        .then(_.partial(createStats, knex))
        .then(_.partial(createTeamStats, knex))
        .then(_.partial(createTeamMemberVersions, knex))
        .then(_.partial(createTeamMembers, knex))
};

var args = process.argv.slice(2);

if(args[0] == "--all") {
    down(knex).then(function() {
        console.log("Dropped all tables");
        return up(knex);
    }).then(function() {
        console.log("Created all tables");
        return populate(knex);
    }).then(function() {
        console.log("Populated with demo data");
        process.exit(0);
    }).catch(function(err) {
        console.log("Error", err);
        process.exit(0);
    });
} else if (args[0] == '--drop') {
    down(knex).then(function() {
        console.log("Dropped all tables");
        process.exit(0);
    });
} else {
    console.log("No operations performed", "Try 'setup.js --all'");
    process.exit(0);
}




