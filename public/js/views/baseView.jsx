var React = require('react');
var Header = require('./header.jsx');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var BaseView = React.createClass({
  render: function() {
    return (
      <div id="base">
        <Header action={this.props.action}/>
        <div className="container">
            <RouteHandler/>
        </div>
      </div>
    );
  }
});

module.exports = BaseView;