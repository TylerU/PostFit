var moment = require('moment'),
    React = require('react'),
    _ = require('underscore'),
    $ = require('jquery-browserify'),
    Router = require('react-router'),
    highcharts = require('highcharts-browserify'),
    Link = Router.Link;

var AthleteData = React.createClass({
    mixins: [Router.Navigation],
    getInitialState: function() {
        return {
            athlete: {
                teams: []
            },
            stats: {},
            selectedStat: null,
        }
    },

    changeHandler: function(e) {
        var name = e.target.value;
        var id = _.filter(this.state.stats, function(elem) {
          return elem.metadata.name === name;
        })[0].metadata.id;

        this.setState({
            selectedStat: id
        });
    },

    initializeGraph: function() {
        if(this.state.selectedStat == null) return;

        var metadata = null;
        var dataStart = _.find(this.state.stats, function(key) {
            return (key.metadata.id == this.state.selectedStat);
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
        dataStart = _.sortBy(dataStart, '0');

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
        this.Service = this.props.Service;
        this.Service.getAthlete(this.props.params.athleteId).then(function(res) {
            if (this.isMounted()) {
                this.setState({
                    athlete: res
                });
            }
        }.bind(this));

        this.Service.getStatsForAthlete(this.props.params.athleteId).then(function(res) {
            var newStat = null;
            if(_.keys(res).length > 0) {
                newStat = res[_.keys(res)[0]].metadata.id;
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
                <option key={elem["metadata"].id}>{name}</option>
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
                        {a.birthDate ? (
                        <tr>
                            <td>Age</td>
                            <td>{moment().diff(a.birthDate, 'years')}</td>
                        </tr>) : ''}
                        <tr>
                            <td>Team Participation</td>
                            <td>{a.teams.map(function(team) {return team.name}).join(', ')}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div>
                        <Link to="editAthlete" params={{schoolId: this.props.params.schoolId, athleteId: this.props.params.athleteId}}> Edit this athlete </Link>
                    </div>
                </div>
                <div className="col-md-9">
                    {options.length == 0 ?
                        <div style={{"textAlign": "center"}}>
                            <h4>No statistics for this Athlete</h4>
                        </div> :
                        <div>
                            <div className="type-dropdown">
                                <select className="form-control" value={this.state.selectedStat} onChange={this.changeHandler}>
                                    {options}
                                </select>
                            </div>
                            <div width="100%" className="graph-container"></div>
                        </div>
                    }
                    <div><Link to="postStat" params={{
                      schoolId: this.props.params.schoolId
                    }} query={{
                      athleteId: this.props.params.athleteId,
                      statTypeId: this.state.selectedStat
                    }}>Post new stat for this athlete</Link></div>
                </div>
            </div>
        );
    }
});

module.exports = AthleteData;