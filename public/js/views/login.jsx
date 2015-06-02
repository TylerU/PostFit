var React = require('react');
var AuthService = require('../auth');

var Login = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        console.log("Logging in");
        var username = React.findDOMNode(this.refs.username).value.trim();
        var password = React.findDOMNode(this.refs.password).value.trim();
        var checked = React.findDOMNode(this.refs.rememberMe).checked;
        AuthService.signIn(username, password, checked).then(function() {
            window.location.reload();
        }.bind(this), function(err){
           console.log("Try again", err)
        });
    },

    render: function () {
        return (
            <form className="form-signin" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label for="inputEmail" className="sr-only">Email address</label>
                <input ref="username" type="username" id="inputEmail" className="form-control" placeholder="Username" required={true} autofocus={true}/>
                <label for="inputPassword" className="sr-only">Password</label>
                <input ref="password" type="password" id="inputPassword" className="form-control" placeholder="Password" required={true}/>
                <div className="checkbox">
                    <label>
                        <input ref="rememberMe" type="checkbox" value="remember-me"/> Remember me
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        );
    }
});


module.exports = Login;
