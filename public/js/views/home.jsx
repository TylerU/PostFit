var React = require('react');
var Link = require('react-router').Link;

var Home = React.createClass({
  render: function() {
    return (
      <div className="jumbotron text-center">
        <h1>PostFit</h1>
        <p className="lead">Tracking high school athletics statistics like never before</p>
        <p><Link to="login" className="btn btn-large btn-success">Get Started</Link></p>
      </div>
    );
  }
});

module.exports = Home;