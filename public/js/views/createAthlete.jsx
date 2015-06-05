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
        console.log('test');
        e.preventDefault();
        var obj = this.refs.form.getValue();

        if (obj) {
            this.setState({wrong: false, errors: {}});
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
        } else {
            this.setState({
                wrong: true,
                errors: {
                    'main': 'Please fix highlighted fields and try again'
                }
            })
        }
    },

    render: function () {
        var yearOptions = {};
        for(var i = 1990; i < 2030; i++) {
            yearOptions[i] = i; //(<option key={i}>{i}</option>);
        }

        var Person = t.struct({
            firstName: t.Str,
            lastName: t.Str,
            birthDate: t.Dat,
            gender: t.enums({
                Male: 'Male',
                Female: 'Female'
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
                {errors}
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                    />
                <button onClick={this.handleSubmit} className="btn btn-success">Create Athlete</button>
            </div>
        );
    }
});


module.exports = Login;
