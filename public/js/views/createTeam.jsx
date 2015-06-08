var React = require('react');
var Service = require('../service');
var Navigation = require('react-router').Navigation;
var _ = require('underscore');

//var BaseForm = require('./baseForm.jsx');

var Formsy = require('formsy-react');
var FRC = require('formsy-react-components');

var Checkbox = FRC.Checkbox;
var CheckboxGroup = FRC.CheckboxGroup;
var Input = FRC.Input;
var RadioGroup = FRC.RadioGroup;
var Row = FRC.Row;
var Select = FRC.Select;
var Textarea = FRC.Textarea;
var ComponentMixin = FRC.ComponentMixin;
var Select = require("react-select");


var AthleteSearch = require('../views/athleteSearch.jsx');

var CreateTeam = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            stats: [],
            team: {},
            athletes: []
        }
    },

    componentWillMount: function() {
        this.Service = this.props.Service;
        this.Service.getStatTypes().then(function(types){
            this.setState({
                stats: types
            });
        }.bind(this));
        this.Service.getAthletes().then(function(athletes){
            this.setState({
                athletes: athletes
            });
        }.bind(this));
        if(this.props.params.teamId) {
            this.Service.getTeamData(this.props.params.teamId).then(function(team) {
                this.setState({
                    team: team
                });
            }.bind(this))
        }
    },

    submitForm: function(obj, reset, setErrors) {
        var operation = this.Service.createTeam;
        obj.members = _.map(obj.members, 'id');

        if(this.props.params.teamId) {
            obj.id = this.state.team.id;
            operation = this.Service.updateTeam;
        }

        operation(obj).then(function(result) {
            if(result.success) {
                this.context.router.transitionTo('teamData', {schoolId: this.props.params.schoolId, teamId: result.data.id});
            }
            else{
                setErrors(result.errors);
            }
        }.bind(this), function(error) {
            console.log("An unknown error occurred: " + error)
        });
    },

    render: function () {
        var transformedStatTypes = [];

        this.state.stats.forEach(function(statType) {
            transformedStatTypes.push({
                value: statType.id,
                label: statType.name
            });
        });


        var formClassName = 'form-horizontal';

        var sharedProps = {
            layout: 'horizontal',
            validatePristine: false
        };
        var team = this.state.team;

        return (
            <div className="row">
                <Formsy.Form className={formClassName} onValidSubmit={this.submitForm} ref="form">
                    <fieldset>
                        <legend>Create/Edit Team</legend>
                        <Input
                            {...sharedProps}
                            name="name"
                            value={team.name || ""}
                            label="Team Name"
                            type="text"
                            placeholder="Team Name"
                            required
                            />
                        <CheckboxGroup
                            {...sharedProps}
                            name="stats"
                            value={team.stats || []}
                            label="Relevant Stats"
                            help="Select the stats which are important to this team."
                            options={transformedStatTypes}
                            multiple
                            />
                        <AthleteSearch
                            multi={true}
                            {...sharedProps}
                            name="members"
                            value={team.members || []}
                            label="Team Members"
                            help="Add a team member"
                            allAthletes={this.state.athletes}
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


module.exports = CreateTeam;

