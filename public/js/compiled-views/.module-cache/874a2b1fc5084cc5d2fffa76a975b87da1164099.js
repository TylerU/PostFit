var React = require('react');

var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("div", {className: "navbar navbar-default"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("a", {className: "navbar-brand", href: "#"}, "PostFit"), 
          React.createElement("ul", {className: "nav navbar-nav"}, 
            React.createElement("li", {className: this.props.action == 'home' ? "active" : ''}, React.createElement("a", {href: "#"}, "Home")), 
            React.createElement("li", {className: this.props.action == '' ? "active" : ''}, React.createElement("a", {href: "#"}, "Teams")), 
            React.createElement("li", {className: this.props.action == 'athlete' || this.props.action == 'athletes' ? "active" : ''}, React.createElement("a", {href: "/#athletes"}, "Athletes"))
          )
        )
      )
    );
  }
});

module.exports = Header;