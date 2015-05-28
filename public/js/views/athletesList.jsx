var React = require('react');
var Service = require('../service.js');


var AthletesList = React.createClass({
  getInitialState: function() {
    return {
      athletes: []
    };
  },

  componentDidMount: function() {
    Service.getAthletes().then(function(arr) {
      if (this.isMounted()) {
        this.setState({
          athletes: arr
        });
      }
    }.bind(this));
  },

  render: function() {
    var items = this.state.athletes.map(function(athlete, i) {
      function navigate() {
        this.props.router.navigate('/athlete/' + athlete.id, {trigger: true});
      }
      return (
        <tr key={athlete.id} onClick={navigate.bind(this)}>
          <th scope="row">{i+1}</th>
          <td>{athlete.firstName}</td>
          <td>{athlete.lastName}</td>
          <td>{athlete.year}</td>
        </tr>
      );
    }.bind(this));
    return (
      <div className="">
        <div className="">Athletes</div>
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th> ID </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Year</th>
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

module.exports = AthletesList;