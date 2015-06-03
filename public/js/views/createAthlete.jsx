var React = require('react');
var Service = require('../service');
var moment = require('moment');
var Navigation = require('react-router').Navigation;
var _ = require('underscore');


var Login = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            wrong: false,
            errors: {}
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.setState({wrong: false, errors: {}});
        var firstName = React.findDOMNode(this.refs.firstName).value.trim();
        var lastName = React.findDOMNode(this.refs.lastName).value.trim();
        var year = React.findDOMNode(this.refs.year).value.trim();
        var birthDate = React.findDOMNode(this.refs.birthDate).value.trim();
        var gender = React.findDOMNode(this.refs.gender).value.trim();

        var obj = {
            firstName: firstName,
            lastName: lastName,
            year: year,
            birthDate: birthDate,
            gender: gender
        };

        Service.createAthlete(obj).then(function(resultAthlete) {
            if(resultAthlete.success) {
                this.context.router.transitionTo('athleteData', {athleteId: resultAthlete.data.id});
            }
            else{
                this.setState({
                    wrong: true,
                    errors: resultAthlete.errors
                });
            }
        }.bind(this), function(error) {
           console.log('error', error);
        }.bind(this));
    },

    render: function () {
        var yearOptions = [];
        for(var i = 1990; i < 2030; i++) {
            yearOptions.push(<option key={i}>{i}</option>);
        }

        var errors = [];
        if (this.state.wrong) {
            errors = _.chain(this.state.errors).values(this.state.errors).map(function(val) {
                return (<div className="alert alert-danger" role="alert">{val}</div>);
            });
        }
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {errors}
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" required={true} className="form-control" ref="firstName" placeholder="First Name" />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" required={true} className="form-control" ref="lastName" placeholder="Last Name" />
                    </div>
                    <div className="form-group">
                        <label>Grad Year</label>
                        <select className="form-control" ref="year" defaultValue={moment().year()}>
                            {yearOptions}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Birth Date</label>
                        <input required={true} type="text" className="form-control" ref="birthDate" placeholder="08/31/1995" />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select ref="gender" className="form-control">
                            <option key="male">Male</option>
                            <option key="female">Female</option>
                            <option key="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-default">Create Athlete</button>
                </form>
            </div>
        );
    }
});


module.exports = Login;
