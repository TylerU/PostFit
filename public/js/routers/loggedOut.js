

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

var LoggedOutRouter = React.createClass({
    render: function() {
        return (
            <div id="base">
                <Header action={this.props.action}/>
                <div className="container">
                    <RouteHandler />
                </div>
            </div>
        );
    }
});

LoggedOutRouter.getRoutes = function() {
    return (
        <Route name="app" path="/" handler={LoggedOutRouter}>
            <Route name="login" path="login" handler={LoginPage} />
            <DefaultRoute name="home" handler={HomePage} />
            <NotFoundRoute handler={LoginPage}/>
        </Route>
    );
};

module.exports = LoggedOutRouter;