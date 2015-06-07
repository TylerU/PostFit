var React = require('react');
var _ = require('underscore');
var Navigation = require('react-router').Navigation;

var TeamView = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            memberData: {
                athletesData: {},
                statsMetadata: []
            },
            team: {},
            teams: []
        };
    },

    getTeamId: function() {
        return this.context.router.getCurrentParams().teamId;
    },

    sportChangeHandler: function(e) {
        var teamName = e.target.value;
        var teamId = _.filter(this.state.teams, function(team) {
            return team.name == teamName;
        })[0].id;

        this.context.router.transitionTo('teamData', {schoolId: this.props.params.schoolId, teamId: teamId});
    },

    loadData: function(){
        this.Service.getTeamMemberData(this.getTeamId()).then(function(res) {
            if (this.isMounted()) {
                this.setState({
                    memberData: res
                });
            }
        }.bind(this));

        this.Service.getTeamData(this.getTeamId()).then(function(res) {
            if (this.isMounted()) {
                this.setState({
                    team: res
                });
            }
        }.bind(this));

        this.Service.getTeams().then(function(res) {
            if (this.isMounted()) {
                this.setState({
                    teams: res
                });
            }
        }.bind(this));
    },

    componentWillReceiveProps: function() {
        this.loadData();
    },

    componentWillMount: function() {
        this.Service = this.props.Service;
        this.loadData();
    },
    navigateToAthlete(athleteId) {
      this.context.router.transitionTo('athleteData', {schoolId: this.props.params.schoolId, athleteId: athleteId});
    },
    render: function() {
        var items = _.map(this.state.memberData.athletesData, function(athlete, i) {
            var statValues = _.map(this.state.memberData.statsMetadata, function(meta, i) {
                var innerContent = '';
                if(athlete[meta.id]) {
                    innerContent = athlete[meta.id].value + ' ' + meta.label;
                }
                else {
                    innerContent = '--';
                }

                return (
                    <td key={meta.id}>{innerContent}</td>
                );
            });


            return (
                <tr key={i} onClick={this.navigateToAthlete.bind(this, athlete.metadata.id)}>
                    <td scope="row">{athlete.metadata.lastName + ", " + athlete.metadata.firstName}</td>
                    <td>{athlete.metadata.year}</td>
                    {statValues}
                </tr>
            );
        }.bind(this));

        var statHeaders = _.map(this.state.memberData.statsMetadata, function(meta) {
            return (
                <th key={meta.id}>{meta.name}</th>
            );
        });

        var teamOptions = _.map(this.state.teams, function(team) {
            return (
                <option key={team.id}>
                    <div className="team-name-header">
                        {team.name}
                    </div>
                </option>
            );
        });

        return (
            <div className="">
                <select className="form-control team-name-select" value={this.state.team.name}  onChange={this.sportChangeHandler}>
                    {teamOptions}
                </select>
                <table className="table table-hover table-condensed">
                    <thead>
                    <tr>
                        <th> Athlete </th>
                        <th> Grad Year </th>
                        {statHeaders}
                    </tr>
                    </thead>
                    <tbody>
                    {items}
                    </tbody>

                </table>
            </div>
        );
    }
});

module.exports = TeamView;