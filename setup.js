var knex = require('./database').knex;
var _ = require('underscore');
var Promise = require('bluebird');

var tables = ['teammember','teammembersversion','teamstat','stat','stattype','user','athlete','team','school'];

var down = function() {
    var curChain = knex.schema;
    for(var i = 0; i < tables.length; i++) {
        curChain = curChain.dropTableIfExists(tables[i]);
    }
    return curChain;
};

var up = function() {
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

function addDemoData(name, arr) {
    return Promise.reduce(arr, function(total, cur) {
        return knex.table(name).insert(cur).then(function(){return 0;});
    }, 0);
}


var populate = function(hugeObj) {
    var curObj = addDemoData(tables[tables.length-1], hugeObj[tables[tables.length-1]]);
    for(var i = tables.length-2; i >= 0; i--) {
        curObj = curObj.then(_.bind(addDemoData, this, tables[i], hugeObj[tables[i]]));
    }
    return curObj;
};

function createHugeObjFromSeparateFiles() {
    var obj = {};
    for(var i = 0; i < tables.length; i++) {
        var arr = require('./demodata/' + tables[i] + 's');
        obj[tables[i]] = arr;
    }
    return obj;
}

function getDBAsJSON(tb) {
    return knex.select().table(tb);
}

var printJSONDB = function() {
    var obj = {};
    var all = [];
    for(var i = 0; i < tables.length; i++) {
        all.push((function(tb) {
            return (getDBAsJSON(tb).then(function(arr) {
                obj[tb] = arr;
            }));
        })(tables[i]));
    }
    return Promise.all(all).then(function() {
        console.log('module.exports = ' + JSON.stringify(obj) );
    });
};

var args = process.argv.slice(2);

if(args[0] == "--all") {
    down().then(function() {
        console.log("Dropped all tables");
        return up();
    }).then(function() {
        console.log("Created all tables");
        return populate(createHugeObjFromSeparateFiles());
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
} else if (args[0] == '--to-json') {
  printJSONDB().then(function() {
      process.exit(0);
  }).catch(function(err) {
      console.log('error', err);
      process.exit(0);
  });
} else if (args[0] == '--from-json' && args.length == 2) {
    var db = require(args[1]);
    down().then(function(){
        console.log("Dropped all tables");
        return up();
    }).then(function() {
        console.log("Created all tables");
        return populate(db);
    }).then(function() {
        console.log("Populated with demo data");
        process.exit(0);
    }).catch(function(err) {
        console.log("Error", err);
        process.exit(0);
    });

} else {
    console.log("No operations performed", "Try 'setup.js --all'");
    process.exit(0);
}




