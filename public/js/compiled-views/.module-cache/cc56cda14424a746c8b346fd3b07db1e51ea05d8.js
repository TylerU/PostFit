var Home = React.createClass({displayName: "Home",
  render: function() {
    return (
      React.createElement("div", {className: "jumbotron text-center"}, 
        React.createElement("h1", null, "PostFit"), 
        React.createElement("p", {className: "lead"}, "Tracking high school athletics stastics like never before."), 
        React.createElement("p", null, React.createElement("a", {href: "/#athletes", className: "btn btn-large btn-success"}, "Get Started"))
      )
    );
  }
});

module.exports = Home;