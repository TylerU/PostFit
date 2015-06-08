var React = require('react');
var Navigation = require('react-router').Navigation;
var _ = require('underscore');
var Formsy = require('formsy-react');
var FRC = require('formsy-react-components');
var moment = require('moment');
var Checkbox = FRC.Checkbox;
var CheckboxGroup = FRC.CheckboxGroup;
var Input = FRC.Input;
var RadioGroup = FRC.RadioGroup;
var Row = FRC.Row;
var Select = FRC.Select;
var Textarea = FRC.Textarea;

var CreateAthlete = React.createClass({
    mixins: [Navigation],

    submitForm: function(obj, reset, setErrors) {
        var operation = this.Service.createAthlete;
        if(this.props.params.athleteId) {
            obj.id = this.state.athlete.id;
            operation = this.Service.updateAthlete;
        }

        operation(obj).then(function(resultAthlete) {
            if(resultAthlete.success) {
                this.context.router.transitionTo('athleteData', {schoolId: this.props.params.schoolId, athleteId: resultAthlete.data.id});
            }
            else{
                setErrors(resultAthlete.errors);
            }
        }.bind(this), function(error) {
            console.log("Server Error: " + error);
        });
    },

    componentWillMount: function() {
        this.Service = this.props.Service;
        this.Service.getTeams().then(function(teams) {
            this.setState({
                teams: teams
            });
        }.bind(this));

        var athleteId = this.props.params.athleteId;
        if(athleteId) {
            this.Service.getAthlete(athleteId).then(function(athlete) {
                athlete.teams = _.map(athlete.teams, 'id');
                athlete.birthDate = moment(athlete.birthDate).format('YYYY-MM-DD');
                this.setState({
                    athlete: athlete
                });
            }.bind(this))
        }
    },

    getInitialState: function() {
        return {
            teams: [],
            athlete: {}
        };
    },

    render: function () {
        var yearOptions = [
            {value: '', label: ''}
        ];
        for(var i = 1990; i < 2030; i++) {
            yearOptions.push({
                value: i,
                label: i
            });
        }

        var genderOptions = [
            {
                value: '',
                label: ''
            },
            {
                value: 'Male',
                label: 'Male'
            },
            {
                value: 'Female',
                label: 'Female'
            }
        ];

        var allTeams = _.map(this.state.teams, function(team) {
            return {
                value: team.id,
                label: team.name
            };
        });

        var formClassName = 'form-horizontal';

        var sharedProps = {
            layout: 'horizontal',
            validatePristine: false
        };

        var athlete = this.state.athlete;

        return (
            <div className="row">
                <Formsy.Form className={formClassName} onValidSubmit={this.submitForm} ref="form">
                    <fieldset>
                        <legend>Create/Edit Athlete</legend>
                        <Input
                            {...sharedProps}
                            name="firstName"
                            value={athlete.firstName || ""}
                            label="First Name"
                            type="text"
                            placeholder="First Name"
                            required
                            />
                        <Input
                            {...sharedProps}
                            name="lastName"
                            value={athlete.lastName || ""}
                            label="Last Name"
                            type="text"
                            placeholder="Last Name"
                            required
                            />
                        <Input
                            {...sharedProps}
                            name="birthDate"
                            value={athlete.birthDate || ""}
                            label="Birth Date"
                            type="date"
                            placeholder="Enter the athlete's date of birth"
                            required
                            />
                        <Select
                            {...sharedProps}
                            name="year"
                            value={athlete.year || ""}
                            label="Graduation Year"
                            options={yearOptions}
                            required
                            />
                        <Select
                            {...sharedProps}
                            name="gender"
                            value={athlete.gender || ""}
                            label="Gender"
                            options={genderOptions}
                            required
                            />
                        <CheckboxGroup
                            {...sharedProps}
                            name="teams"
                            value={athlete.teams || []}
                            label="Team Membership"
                            help="Select the teams which this athlete is a member of."
                            options={allTeams}
                            multiple
                            />

                    </fieldset>
                    <Row layout={sharedProps.layout}>
                        <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
                    </Row>
                </Formsy.Form>
            </div>
        );

    }
});


module.exports = CreateAthlete;
