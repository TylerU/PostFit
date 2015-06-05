var React = require('react');
var Service = require('../service');
var moment = require('moment');
var Navigation = require('react-router').Navigation;
var _ = require('underscore');

var t = require('tcomb-form');
var Form = t.form.Form;

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
        var value = this.refs.form.getValue();
        // if validation fails, value will be null
        if (value) {
            // value here is an instance of Person
            console.log(value);
        }
        return;

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
            this.setState({
                wrong: true,
                errors: {
                    err1: "an unknown error occurred"
                }
            });
        }.bind(this));
    },

    render: function () {
        //var SignupForm = forms.Form.extend({
        //    username: forms.CharField(),
        //    email: forms.EmailField(),
        //    password: forms.CharField({widget: forms.PasswordInput}),
        //    confirmPassword: forms.CharField({widget: forms.PasswordInput}),
        //    acceptTerms: forms.BooleanField({required: true})
        //});
        var yearOptions = {};
        for(var i = 1990; i < 2030; i++) {
            yearOptions[i] = i; //(<option key={i}>{i}</option>);
        }
        var Person = t.struct({
            firstName: t.Str,
            lastName: t.Str,
            birthDate: t.Dat,
            gender: t.enums({
                M: 'Male',
                F: 'Female'
            }),
            year: t.enums(yearOptions)
    });



        var errors = [];
        if (this.state.wrong) {
            errors = _.chain(this.state.errors).values(this.state.errors).map(function(val) {
                return (<div className="alert alert-danger" role="alert">{val}</div>);
            });
        }
        var options = {

        };
        return (
            <div>
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                    />
                <button onClick={this.handleSubmit}>Save</button>
            </div>

        );
        //return <form onSubmit={this.handleSubmit}>
        //    <forms.RenderForm form={SignupForm} ref="signupForm"/>
        //    <button>Sign Up</button>
        //</form>
        //return (
        //    <div>
        //        <form onSubmit={this.handleSubmit}>
        //            {errors}
        //            <div className="form-group">
        //                <label>First Name</label>
        //                <input type="text" required={true} className="form-control" ref="firstName" placeholder="First Name" />
        //            </div>
        //            <div className="form-group">
        //                <label>Last Name</label>
        //                <input type="text" required={true} className="form-control" ref="lastName" placeholder="Last Name" />
        //            </div>
        //            <div className="form-group">
        //                <label>Grad Year</label>
        //                <select className="form-control" ref="year" defaultValue={moment().year()}>
        //                    {yearOptions}
        //                </select>
        //            </div>
        //
        //            <div className="form-group">
        //                <label>Birth Date</label>
        //                <input required={true} type="text" className="form-control" ref="birthDate" placeholder="08/31/1995" />
        //            </div>
        //
        //            <div className="form-group">
        //                <label>Gender</label>
        //                <select ref="gender" className="form-control">
        //                    <option key="male">Male</option>
        //                    <option key="female">Female</option>
        //                    <option key="other">Other</option>
        //                </select>
        //            </div>
        //            <button type="submit" className="btn btn-default">Create Athlete</button>
        //        </form>
        //    </div>
        //);
    }
});


module.exports = Login;
