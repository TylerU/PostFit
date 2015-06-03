var $ = require('jquery-browserify'),
    jQuery = require('jquery-browserify');
var Auth = require('./auth');
var _ = require('underscore');

var Service = (function(){

    var route = '/api/1/';

    function createAthlete(athlete) {
        return $.ajax({
            url: route + "athletes",
            type:"POST",
            headers: _.extend(Auth.getHeaders(), {
                "Accept" : "application/json; charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }),
            data: athlete,
            dataType:"json"
        });
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
        createAthlete: createAthlete,
        getAthlete: getAthlete,
        getStats: getStats,
        getTeams: getTeams,
        getTeamData: getTeamData,
        getTeamMemberData: getTeamMemberData,
    }
})();

module.exports = Service;
