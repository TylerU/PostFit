var React = require('react');

var BaseView = React.createClass({displayName: "BaseView",
  render: function() {
    return (
      React.createElement("div", {id: "base"}, 
        React.createElement(Header, {action: this.props.action}), 
        React.createElement("div", {className: "container"}, 
                this.props.children
        )
      )
    );
  }
});

module.exports = BaseView;