var React = require('react');
var Service = require('../service.js');
var _ = require('underscore');

var TeamView = React.createClass({
  getInitialState: function() {
    return {
      memberData: {
        athletesData: {},
        statsMetadata: []
      },
      team: {}
    };
  },

  componentDidMount: function() {
    Service.getTeamMemberData(this.props.args[0]).then(function(res) {
      if (this.isMounted()) {
        this.setState({
          memberData: res
        });
      }
    }.bind(this));

    Service.getTeamData(this.props.args[0]).then(function(res) {
      if (this.isMounted()) {
        this.setState({
          team: res
        });
      }
    }.bind(this));
  },

  render: function() {
    var items = _.map(this.state.memberData.athletesData, function(athlete, i) {
      var statValues = _.map(this.state.memberData.statsMetadata, function(meta, i) {
        var innerContent = '';
        if(athlete[meta.id]) {
          innerContent = athlete[meta.id] + ' ' + meta.label;
        }
        else {
          innerContent = '--';
        }

        return (
          <td key={meta.id}>{innerContent}</td>
        );
      });

      return (
        <tr key={i}>
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
    return (
      <div className="">
        <div className="team-name-header">{this.state.team.name}</div>
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th> Athlete </th>
              <th> Year </th>
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