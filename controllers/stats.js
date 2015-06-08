// Load required packages
var Athlete = require('../models/athlete');
var Stat = require('../models/stat');
var StatType = require('../models/statType');
var _ = require('../lib/underscore');
var Promise = require('bluebird');
var knex = require('../database').knex;


exports.postStatType = function (req, res) {
    var schoolId = parseInt(req.params.school_id);

    var statType = {};

    statType.type = req.body.type;
    statType.name = req.body.name;
    statType.label = req.body.label;
    statType.converter = req.body.converter;
    statType.school_id = schoolId;

    new StatType(statType).save().then(function (result) {
        res.json({message: 'Stat type added to the database!', data: statType});
    }, function (err) {
        res.send(err);
    });
};

exports.getStatTypes = function (req, res) {
    var schoolId = parseInt(req.params.school_id);

    StatType.query({
        where: {
            school_id: schoolId
        }
    }).fetchAll().then(function (stattypes) {
        res.json(stattypes.toJSON());
    }, function (err) {
        res.send(err);
    });
};

//exports.deleteStatType = function (req, res) {
//    var id = req.params.statType_id;
//    var schoolId = parseInt(req.params.school_id);
//
//    new StatType({id: id, school_id: schoolId}).fetch().then(function(statType){
//        if(statType) {
//            statType.destroy().then(function (result) {
//                res.json({message: 'Stat type deleted!'});
//            }, function(err){
//                res.send(err);
//            });
//        }
//        else {
//            res.json({message: 'nothing deleted'})
//        }
//    }, function(err) {
//        res.send(err);
//    });
//};

var addStat = Promise.method(function(schoolId, obj) {
    var stat = {};

    // Set the stat properties that came from the POST data
    stat.stattype_id = parseInt(obj.stattype_id);
    stat.value = obj.value;
    stat.time = new Date(obj.time);
    stat.athlete_id = parseInt(obj.athlete_id);
    stat.school_id = schoolId;
    console.log(stat);

    // Save the stat and check for errors
    var typePromise = new StatType({id: stat.stattype_id}).fetch().tap();
    var athletePromise = new Athlete({id: stat.athlete_id}).fetch().tap();

    return typePromise.then(Promise.method(function(stattype) {
        stattype = stattype.toJSON();
        if(stattype.school_id != schoolId) {
            console.log('er1');
            throw {
                success: false,
                message: "Improper stat type."
            };
        }
        return athletePromise;
    })).then(function(athlete){
        athlete = athlete.toJSON();
        if(athlete.school_id != schoolId) {
            throw {
                success: false,
                message: "Improper athlete."
            };
        }
        return new Stat(stat).save();
    });
});

exports.postStat = function (req, res) {
    var schoolId = parseInt(req.params.school_id);
    addStat(schoolId, req.body).then(function (result) {
        res.json({success: true, data: result});
    }, function(err){
        res.send({success: false, errors: err});
    });
};

exports.postStats = function(req, res) {
    var schoolId = parseInt(req.params.school_id);
    var statsArr = JSON.parse(req.body.statsArr);

    var promises = _.map(statsArr, function(statObj) {
        return addStat(schoolId, statObj);
    });

    Promise.all(promises).then(function() {
        res.json({success: true});
    }, function(err) {
        res.json({success: false, error: err});
    });
};

exports.deleteStat = function (req, res) {
    var id = req.params.stat_id;
    var schoolId = parseInt(req.params.school_id);

    new Stat({id: id, school_id: schoolId}).fetch().then(function(stat){
        if(stat) {
            stat.destroy().then(function(result) {
                res.json({message: 'Stat deleted!'});
            }, function (err) {
                res.send(err);
            });
        }
        else {
            res.send('nothing deleted');
        }
    }, function(err) {
        res.send(err);
    });
};

exports.getStats = function (req, res) {
    // Use the Stat model to find a specific stats
    var athleteId = req.params.athlete_id;
    var schoolId = parseInt(req.params.school_id);

    new Athlete({school_id: schoolId, id: athleteId}).fetch().then(function(ath){
        if(!ath) return res.send('error');
        // select * from stattype where id in (select stattype_id from stat where athlete_id = 1)
        var subquery = knex.select('stattype_id').from('stat').where('athlete_id', athleteId);
        var outerQuery = knex('stattype').whereIn('id', subquery);

        outerQuery.then(function(result) {
            var objFinal = {};
            var calls = [];
            _.forEach(result, function (type) {
                var typeId = type.id;

                if (!objFinal[typeId]) {
                    objFinal[typeId] = {};
                }

                objFinal[typeId]["metadata"] = _.pick(type, 'id', 'type', 'name', 'label', 'converter');

                calls.push(
                    Stat.query({where: {stattype_id: typeId, athlete_id: athleteId}}).fetchAll().then(function (result) {
                        if (!objFinal[typeId]) {
                            objFinal[typeId] = {};
                        }

                        objFinal[typeId]["data"] = _.map(result.toJSON(), function (eachRes) {
                            return _.pick(eachRes, 'id', 'value', 'time');
                        });

                    })
                );
            });

            Promise.all(calls).then(function() {
                res.send(objFinal);
            }, function(err) {
                res.send(err);
            });

        });
    }, function(err) {
        res.send(err);
    });
};