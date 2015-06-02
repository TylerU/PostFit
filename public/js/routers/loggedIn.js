

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
var AthleteData = require('../views/athleteData.jsx');
var TeamView = require('../views/teamView.jsx');
var Navigation = Router.Navigation;

var LoggedInRouter = React.createClass({
    mixins: [Navigation],

    signOut: function() {
        AuthService.signOut();
        window.location.reload();
    },

    render: function() {
        return (
            <div id="base">
                <div className="navbar navbar-default">
                    <div className="container">
                        <Link to='home' className="navbar-brand">Postfit</Link>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="" onClick={this.signOut}>Sign Out</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});

LoggedInRouter.getRoutes = function() {
    return (
        <Route name="app" path="/" handler={LoggedInRouter}>
            <DefaultRoute name="home" handler={Dashboard} />
            <Route name="athleteData" path="/athlete/:athleteId" handler={AthleteData} />
            <Route name="teamData" path="/team/:teamId" handler={TeamView} />
            <Redirect from="login" to="home" />
            <NotFoundRoute handler={Content404}/>
        </Route>
    );
};

module.exports = LoggedInRouter;
