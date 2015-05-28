var $ = require('jquery-browserify'),
  jQuery = require('jquery-browserify');

var Service = (function(){
  var athletesMemo = null;
  var statsMemo = {};

  var route = './api/';

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
    var dfd = new jQuery.Deferred();
    return $.get(route + 'athletes/' + athleteId);
    return dfd.promise();
  }

  function getStats(athleteId) {
    var dfd = new jQuery.Deferred();

    if(athletesMemo) {
      dfd.resolve(athletesMemo);
    }
    else {
      $.get(route + 'stats/' + athleteId).then(function(res) {
        dfd.resolve(res);
      }).fail(function(err) {
        dfd.reject(err);
      });
    }

    return dfd.promise();
  }

  function getTeams() {
    var dfd = new jQuery.Deferred();

    $.get(route + 'teams').then(function(res) {
      dfd.resolve(res);
    }).fail(function(err) {
      dfd.reject(err);
    });

    return dfd.promise();
  }

  function getTeamData(teamId) {
    var dfd = new jQuery.Deferred();

    $.get(route + 'teams/' + teamId).then(function(res) {
      dfd.resolve(res);
    }).fail(function(err) {
      dfd.reject(err);
    });

    return dfd.promise();
  }

  function getTeamMemberData(teamId) {
    var dfd = new jQuery.Deferred();

    $.get(route + 'teams/memberStats/' + teamId).then(function(res) {
      dfd.resolve(res);
    }).fail(function(err) {
      dfd.reject(err);
    });

    return dfd.promise();
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
