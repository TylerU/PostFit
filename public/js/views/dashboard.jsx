var React = require('react');
var Link = require('react-router').Link;

var Dashboard = React.createClass({
    render: function() {
        return (
            <div className="jumbotron text-center">
                <h1>PostFit Dashboard</h1>
            </div>
        );
    }
});

module.exports = Dashboard;