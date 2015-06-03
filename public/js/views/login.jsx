var React = require('react');
var AuthService = require('../auth');

var Login = React.createClass({
    getInitialState: function() {
        return {
            wrong: false
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        this.setState({wrong: false});
        var username = React.findDOMNode(this.refs.username).value.trim();
        var password = React.findDOMNode(this.refs.password).value.trim();
        AuthService.signIn(username, password).then(function() {
            window.location.reload();
        }.bind(this), function(err){
            this.setState({wrong: true});
        }.bind(this));
    },

    render: function () {
        return (
            <form className="form-signin" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Please sign in</h2>
                { this.state.wrong ? <div className="alert alert-danger" role="alert">Incorrect username or password</div> : null }


                <label for="inputEmail" className="sr-only">Email address</label>
                <input ref="username" type="username" id="inputEmail" className="form-control" placeholder="Username" required={true} autofocus={true}/>
                <label for="inputPassword" className="sr-only">Password</label>
                <input ref="password" type="password" id="inputPassword" className="form-control" placeholder="Password" required={true}/>

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        );
    }
});


module.exports = Login;
