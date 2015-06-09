var $ = require('jquery-browserify');
var Auth = require('./auth');
var _ = require('underscore');

var Router = require('react-router');

var Service = (function(){

    var route = '/api/';

    function postRequest(schoolId, url, data) {
        return $.ajax({
            url: route + schoolId + '/' + url,
            type:"POST",
            headers: _.extend(Auth.getHeaders(), {
                "Accept" : "application/json; charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }),
            data: data,
            dataType:"json"
        });
    }

    function putRequest(schoolId, url, data) {
        return $.ajax({
            url: route + schoolId + '/' + url,
            type:"PUT",
            headers: _.extend(Auth.getHeaders(), {
                "Accept" : "application/json; charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }),
            data: data,
            dataType:"json"
        });
    }

    function getRequest(schoolId, url) {
        return $.ajax(route + schoolId + '/' + url, {headers: Auth.getHeaders()});
    }

    return {
        getUser: function() {
            return $.ajax(route + 'user', {headers: Auth.getHeaders()});
        },
        createStat: function(schoolId, stat) {
            return postRequest(schoolId, "stats", stat);
        },

        createAthlete: function(schoolId, athlete) {
            return postRequest(schoolId, "athletes", athlete);
        },

        updateAthlete: function(schoolId, athlete) {
            return putRequest(schoolId, "athletes/" + athlete.id, athlete);
        },

        createTeam: function(schoolId, team) {
            return postRequest(schoolId, "teams", team);
        },

        updateTeam: function(schoolId, team) {
            return putRequest(schoolId, "teams/" + team.id, team);
        },

        getStatTypes: function(schoolId) {
            return getRequest(schoolId, 'statTypes')
        },

        getAthlete: function(schoolId, athleteId) {
            return getRequest(schoolId, 'athletes/' + athleteId);
        },

        getAthletes: function(schoolId) {
            return getRequest(schoolId, 'athletes/');
        },

        getStatsForAthlete: function(schoolId, athleteId) {
            return getRequest(schoolId, 'stats/' + athleteId);
        },

        getTeams: function(schoolId) {
            return getRequest(schoolId, 'teams');
        },

        getTeamData: function(schoolId, teamId) {
            return getRequest(schoolId, 'teams/' + teamId);
        },

        getTeamMemberData: function(schoolId, teamId) {
            return getRequest(schoolId, 'teams/memberStats/' + teamId);
        }

    };
})();

module.exports = Service;
