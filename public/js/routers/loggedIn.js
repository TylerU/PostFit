

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
var PostStat = require('../views/createStat.jsx');

var Dashboard = require('../views/dashboard.jsx');
var AuthService = require('../auth');
var AthleteData = require('../views/athleteData.jsx');
var TeamView = require('../views/teamView.jsx');
var Navigation = Router.Navigation;
var CreateAthlete = require('../views/createAthlete.jsx');
var CreateTeam = require('../views/createTeam.jsx');
var Service = require('../service');
var _ = require('underscore');

var LoggedInRouter = React.createClass({
    mixins: [Navigation],

    signOut: function() {
        AuthService.signOut();
        window.location.reload();
    },

  /*
   <form className="navbar-form navbar-right">
   <div className="form-group">
   <input type="text" className="form-control" placeholder="Search" />
   </div>
   </form>
   */
    render: function() {
        return (
            <div id="base">
              <nav className="navbar navbar-default">
                <div className="container">
                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-3">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to="home">PostFit</Link>
                  </div>

                  <div className="collapse navbar-collapse" id="navbar-collapse-3">
                    <button type="button" onClick={this.signOut} className="hidden-xs btn btn-default navbar-btn navbar-right">Sign Out</button>
                    <button type="button" onClick={this.signOut} className="visible-xs btn btn-default navbar-btn navbar-right">Sign Out</button>
                  </div>
                </div>
              </nav>
                <div className="container">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});
var SchoolRouter = React.createClass({
    mixins: [Navigation],

    getBoundService(service, schoolId) {
        return _.mapObject(service, function(fn) {
            return fn.bind(service, schoolId);
        });
    },

    render: function() {
        return (
            <RouteHandler Service={this.getBoundService(Service, this.props.params.schoolId)}/>
        );
    }
});

LoggedInRouter.getRoutes = function() {
    return (
        <Route name="app" path="/" handler={LoggedInRouter}>
            <DefaultRoute name="home" handler={Dashboard} />
            <Route name="school" path="/school/:schoolId" handler={SchoolRouter}>
                <Route name="athleteData" path="athlete/:athleteId" handler={AthleteData} />
                <Route name="teamData" path="team/:teamId" handler={TeamView} />
                <Route name="createAthlete" path="editAthlete" handler={CreateAthlete} />
                <Route name="createTeam" path="editTeam" handler={CreateTeam} />
                <Route name="editAthlete" path="editAthlete/:athleteId" handler={CreateAthlete} />
                <Route name="editTeam" path="editTeam/:teamId" handler={CreateTeam} />
                <Route name="postStat" path="postStat" handler={PostStat} />

            </Route>
            <Redirect from="login" to="home" />
            <NotFoundRoute handler={Content404}/>
        </Route>
    );
};

module.exports = LoggedInRouter;
