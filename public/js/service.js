var $ = require('jquery-browserify'),
    jQuery = require('jquery-browserify');
var AuthService = require('./auth');

var Service = (function(){
    var athletesMemo = null;
    var statsMemo = {};

    var route = './api/1/';

    function getAthletes() {
        var dfd = new jQuery.Deferred();

        if(athletesMemo) {
            dfd.resolve(athletesMemo);
        }
        else {
            $.get(route + 'athletes').then(function(res) {
                dfd.resolve(res);
            }).fail(function(err) {
                dfd.reject(err);
            });
        }

        return dfd.promise();
    }

    function getAthlete(athleteId) {
        //var dfd = new jQuery.Deferred();
        //return $.get(route + 'athletes/' + athleteId);
        return $.ajax(route + 'athletes/' + athleteId, {headers: Auth.getHeaders()});
        //return dfd.promise();
    }

    function getStats(athleteId) {
        return $.ajax(route + 'stats/' + athleteId, {headers: Auth.getHeaders()});
    }

    function getTeams() {
        return $.ajax(route + 'teams', {headers: Auth.getHeaders()});
    }

    function getTeamData(teamId) {
        return $.ajax(route + 'teams/' + teamId, {headers: Auth.getHeaders()});
    }

    function getTeamMemberData(teamId) {
        return $.ajax(route + 'teams/memberStats/' + teamId, {headers: Auth.getHeaders()});
    }

    return {
        getAthletes: getAthletes,
        getAthlete: getAthlete,
        getStats: getStats,
        getTeams: getTeams,
        getTeamData: getTeamData,
        getTeamMemberData: getTeamMemberData,
    }
})();

module.exports = Service;
