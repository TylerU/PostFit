var _ = require('underscore');

function CreateSimpleGetter(Component, gettersMap) {
  var StoreConnection = React.createClass({
    componentWillMount() {
      _.keys(gettersMap).forEach((key) => {
        gettersMap[key]().then((result) => {
          var obj = {};
          obj[key] = result;
          Component.setState(obj)
        });
      });
    },

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });
  return StoreConnection;
};

module.exports = CreateSimpleGetter;