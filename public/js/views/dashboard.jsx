var React = require('react');
var Link = require('react-router').Link;
var Service = require('../service');

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            user: {},
            schoolId: null
        };
    },

    componentWillMount: function() {
        Service.getUser().then(function(user) {
            if(user) {
                var schoolId = user.school_id;
                Service.getTeams(schoolId).then(function(teams) {
                    if(teams) {
                        this.setState({
                            user: user,
                            schoolId: user.school_id,
                            team1Id: teams[0].id
                        });
                    }
                }.bind(this));
            }
        }.bind(this));
    },

    render: function() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <h1>PostFit Dashboard</h1>
                </div>
                <div>
                    {this.state.schoolId ?
                        <div>
                            <div>
                                <Link to="teamData" params={{schoolId: this.state.schoolId, teamId: this.state.team1Id}}>View Teams</Link>
                            </div>
                            <br />
                            <br />
                            <div>
                                <Link to="createTeam" params={{schoolId: this.state.schoolId}}>Create Team</Link>
                            </div>
                            <div>
                                <Link to="createAthlete" params={{schoolId: this.state.schoolId}}>Create Athlete</Link>
                            </div>
                            <div>
                                <Link to="postStat" params={{schoolId: this.state.schoolId}}>Post Stat</Link>
                            </div>
                            <div>
                              <Link to="postStats" params={{schoolId: this.state.schoolId}}>Post Stats Bulk</Link>
                            </div>
                        </div> :
                        <div></div>}
                </div>
            </div>
        );
    }
});

module.exports = Dashboard;