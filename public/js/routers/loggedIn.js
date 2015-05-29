

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var HomePage = require('../views/home.jsx');
var Route = Router.Route;
var Content404 = require('../views/content404.jsx');
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;
var Header = require('../views/header.jsx');
var LoginPage = require('../views/login.jsx');
var Dashboard = require('../views/dashboard.jsx');
var AuthService = require('../auth');

var LoggedInRouter = React.createClass({
    signOut: function() {
        AuthService.signOut();
        window.location.href = '../';
    },

    render: function() {
        return (
            <div id="base">
                <div className="navbar navbar-default">
                    <div className="container">
                        <a className="navbar-brand" href="#">PostFit</a>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="" onClick={this.signOut}>Sign Out</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container">
                    <RouteHandler />
                </div>
            </div>
        );
    }
});

LoggedInRouter.getRoutes = function() {
    return (
        <Route name="app" path="/" handler={LoggedInRouter}>
            <DefaultRoute name="home" handler={Dashboard} />
            <NotFoundRoute handler={Content404}/>
        </Route>
    );
};

module.exports = LoggedInRouter;
