var React = require('react');
var Link = require('react-router').Link;

var Header = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <Link className="navbar-brand" to="home">PostFit</Link>
          <ul className="nav navbar-nav navbar-right">
              <li><Link to="login">Login</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Header;