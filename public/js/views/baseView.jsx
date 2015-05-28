var React = require('react');
var Header = require('./header.jsx');

var BaseView = React.createClass({
  render: function() {
    return (
      <div id="base">
        <Header action={this.props.action}/>
        <div className="container">
                {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = BaseView;