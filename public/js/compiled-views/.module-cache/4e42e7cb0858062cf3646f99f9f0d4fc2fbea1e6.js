var AthletesList = React.createClass({displayName: "AthletesList",
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
        this.props.router.navigate('/athlete/' + athlete._id, {trigger: true});
      }
      return (
        React.createElement("tr", {key: athlete._id, onClick: navigate.bind(this)}, 
          React.createElement("th", {scope: "row"}, i+1), 
          React.createElement("td", null, athlete.firstName), 
          React.createElement("td", null, athlete.lastName), 
          React.createElement("td", null, athlete.year)
        )
      );
    }.bind(this));
    return (
      React.createElement("div", {className: ""}, 
        React.createElement("div", {className: ""}, "Athletes"), 
        React.createElement("table", {className: "table table-hover table-condensed"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, " ID "), 
              React.createElement("th", null, "First Name"), 
              React.createElement("th", null, "Last Name"), 
              React.createElement("th", null, "Year")
            )
          ), 
          React.createElement("tbody", null, 
                items
          )

        )
      )
    );
  }
});

module.exports = AthletesList;