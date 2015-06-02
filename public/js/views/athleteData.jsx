var moment = require('moment'),
  React = require('react'),
  Service = require('../service.js'),
  _ = require('underscore'),
  $ = require('jquery-browserify'),
  highcharts = require('highcharts-browserify');

var AthleteData = React.createClass({
  getInitialState: function() {
    return {
      athlete: {},
      stats: {},
      selectedStat: null,
    }
  },

  changeHandler: function(e) {
    this.setState({
      selectedStat: e.target.value
    });
  },

  initializeGraph: function() {
    if(this.state.selectedStat == null) return;

    var metadata = null;
    var dataStart = _.find(this.state.stats, function(key) {
      return (key.metadata.name == this.state.selectedStat);
    }.bind(this));

    if(dataStart) {
      metadata = dataStart.metadata;
      dataStart = dataStart.data;
    }
    else {
      return;
    }

    var dataStart = dataStart.map(function(elem) {
      return [moment(elem.time).utc().valueOf(), elem.value];
    });

    $('.graph-container').highcharts({
      chart: {
        type: 'spline'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%b %e, %Y',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: metadata.name + ' (' + metadata.label + ')'
        },
        min: 0
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.x:%b %e, %Y}: {point.y:.2f} ' + metadata.label
      },

      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },

      series: [{
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: dataStart
      }]
    });
  },

  componentDidMount: function() {
      Service.getAthlete(this.props.params.athleteId).then(function(res) {
      if (this.isMounted()) {
        this.setState({
          athlete: res
        });
      }
    }.bind(this));

    Service.getStats(this.props.params.athleteId).then(function(res) {
      var newStat = null;
      if(_.keys(res).length > 0) {
        newStat = res[_.keys(res)[0]].metadata.name;
      }

      if (this.isMounted()) {
        this.setState({
          stats: res,
          selectedStat: newStat,
        });
      }
    }.bind(this));
  },

  componentDidUpdate: function() {
    this.initializeGraph();
  },

  render: function() {
    var a = this.state.athlete;
    var options = _.map(this.state.stats, function(elem) {
      var name = elem["metadata"].name;
      return (
        <option key={name}>{name}</option>
      );
    });

    return (
      <div className="row">
        <div className="athlete-specs col-md-3">
          <div className="athlete-specs-name">{a.firstName + " " + a.lastName}</div>
          <table className="table table-condensed table-hover">
            <tbody>
              <tr>
                <td>Gender</td>
                <td>{a.gender}</td>
              </tr>
              <tr>
                <td>Year</td>
                <td>{a.year}</td>
              </tr>
              <tr>
                <td>Age</td>
                <td>{moment().diff(a.birthDate, 'years')}</td>
              </tr>
              <tr>
                <td>Team Participation</td>
                <td>{a.teams}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-9">
          <div className="type-dropdown">
            <select className="form-control" value={this.state.selectedStat} onChange={this.changeHandler}>
                  {options}
            </select>
          </div>
          <div width="100%" className="graph-container">
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AthleteData;