var React = require('react');

var Home = React.createClass({
  render: function() {
    return (
      <div className="jumbotron text-center">
        <h1>PostFit</h1>
        <p className="lead">Tracking high school athletics stastics like never before.</p>
        <p><a href="/#athletes" className="btn btn-large btn-success">Get Started</a></p>
      </div>
    );
  }
});

module.exports = Home;