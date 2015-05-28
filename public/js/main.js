var BaseView = require('./views/baseView.jsx');
var Home = require('./views/home.jsx');
var AthletesList = require('./views/athletesList.jsx');
var AthleteData = require('./views/athleteData.jsx');
var TeamView = require('./views/teamView.jsx');
var Content404 = require('./views/content404.jsx');
var $ = require('jquery-browserify');
var React = require('react');
var Backbone = require('backbone');
Backbone.$ = $;


var Router = Backbone.Router.extend({
  routes: {
    "": "home",
    "athletes": "athletes",
    "athlete/:athleteId": "athlete",
    "teams": "teams",
    "team/:teamId": "team",
    "*err": "404",
  },
});

var router = new Router();

router.on('route', function(action, a) {
  var pathMapping = {
    "home": Home,
    "athletes": AthletesList,
    "athlete": AthleteData,
    "team": TeamView
  };

  var Content = pathMapping[action] || Content404;

  React.render(
    React.createElement(BaseView, {router: router, action: action},
      React.createElement(Content, {router: router, args: a})
    ),
    document.getElementById("page")
  );
});

Backbone.history.start({pushState: false});