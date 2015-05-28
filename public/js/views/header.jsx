var React = require('react');

var Header = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <a className="navbar-brand" href="#">PostFit</a>
          <ul className="nav navbar-nav">
            <li className={this.props.action == 'home' ? "active" : ''}><a href="#">Home</a></li>
            <li className={this.props.action == '' ? "active" : ''}><a href="#">Teams</a></li>
            <li className={this.props.action == 'athlete' || this.props.action == 'athletes' ? "active" : ''}><a href="/#athletes">Athletes</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Header;