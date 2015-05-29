var React = require('react');

var Header = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <a className="navbar-brand" href="#">PostFit</a>
          <ul className="nav navbar-nav navbar-right">
              <li><a href="./#login">Login</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Header;