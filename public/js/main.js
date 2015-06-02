var BaseView = require('./views/baseView.jsx');
var Home = require('./views/home.jsx');
var AthletesList = require('./views/athletesList.jsx');
var AthleteData = require('./views/athleteData.jsx');
var TeamView = require('./views/teamView.jsx');
var Content404 = require('./views/content404.jsx');
var $ = require('jquery-browserify');
var React = require('react');
var Auth = require('./auth');

var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

//var Backbone = require('backbone');
//Backbone.$ = $;

//var Router = Backbone.Router.extend({
//  routers: {
//    "": "home",
//    "athletes": "athletes",
//    "athlete/:athleteId": "athlete",
//    "teams": "teams",
//    "team/:teamId": "team",
//    "*err": "404",
//  },
//});
//
//var router = new Router();
//
//router.on('route', function(action, a) {
//  var pathMapping = {
//    "home": Home,
//    "athletes": AthletesList,
//    "athlete": AthleteData,
//    "team": TeamView
//  };
//
//  var Content = pathMapping[action] || Content404;
//
//  React.render(
//    React.createElement(BaseView, {router: router, action: action},
//      React.createElement(Content, {router: router, args: a})
//    ),
//    document.getElementById("page")
//  );
//});
//
//Backbone.history.start({pushState: false});

//var routes = (
//    <Route handler={BaseView} path="/">
//        <DefaultRoute handler={Home} />
//        <Route name="about" handler={AthletesList} />
//        <NotFoundRoute handler={Content404}/>
//        <Redirect from="company" to="about" />
//    </Route>
//);
//
//Router.run(routes, function (Handler) {
//    React.render(<Handler/>, document.body);
//});


// Routers
var LoggedOutRouter = require("./routers/loggedOut");
var LoggedInRouter = require("./routers/loggedIn");


// ID of the DOM element to mount app on
var DOM_APP_EL_ID = "page";


// Initialize routers depending on session
var routes;

if (Auth.isLoggedIn()) {
    routes = LoggedInRouter.getRoutes();
} else {
    routes = LoggedOutRouter.getRoutes();
}

//var fetchData = function(routes, params) {
//    var data = {};
//
//    return Promise.all(
//        routes
//            .filter(function(route) {return route.handler.fetchData;})
//            .map(function(route) {
//                return route.handler.fetchData(params).then(function(resp) {
//                    data[route.name] = resp;
//                });
//            })
//    ).then(function(){return data;});
//};

// Start the router
//Router.run(routes, Router.HistoryLocation, function(Handler, state) {
Router.run(routes, Router.HistoryLocation, function(Handler, state) {
    //fetchData(state.routes, state.params).then(function(data) {
        return React.render(<Handler />, document.getElementById(DOM_APP_EL_ID));
    //});
});
