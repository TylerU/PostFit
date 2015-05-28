var moment = require('/vendor/moment'),
  Service = require('/service.js');

var AthleteData = React.createClass({displayName: "AthleteData",
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
    Service.getAthlete(this.props.args[0]).then(function(res) {
      if (this.isMounted()) {
        this.setState({
          athlete: res
        });
      }
    }.bind(this));

    Service.getStats(this.props.args[0]).then(function(res) {
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
        React.createElement("option", {key: name}, name)
      );
    });

    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "athlete-specs col-md-3"}, 
          React.createElement("div", {className: "athlete-specs-name"}, a.firstName + " " + a.lastName), 
          React.createElement("table", {className: "table table-condensed table-hover"}, 
            React.createElement("tbody", null, 
              React.createElement("tr", null, 
                React.createElement("td", null, "Gender"), 
                React.createElement("td", null, a.gender)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Year"), 
                React.createElement("td", null, a.year)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Age"), 
                React.createElement("td", null, moment().diff(a.birthDate, 'years'))
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Height"), 
                React.createElement("td", null, a.height)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Team Participation"), 
                React.createElement("td", null, a.teams)
              )
            )
          )
        ), 
        React.createElement("div", {className: "col-md-9"}, 
          React.createElement("div", {className: "type-dropdown"}, 
            React.createElement("select", {className: "form-control", value: this.state.selectedStat, onChange: this.changeHandler}, 
                  options
            )
          ), 
          React.createElement("div", {width: "100%", className: "graph-container"}
          )
        )
      )
    );
  }
});

module.exports = AthleteData;