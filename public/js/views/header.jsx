var React = require('react');
var Link = require('react-router').Link;

var Header = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <Link className="navbar-brand" to="home">PostFit</Link>
          <button type="button" onClick={this.signOut} className="btn btn-default navbar-btn navbar-right"><Link to="login">Login</Link></button>
        </div>
      </div>
    );
  }
});

module.exports = Header;