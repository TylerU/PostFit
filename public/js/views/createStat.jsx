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

var AthleteSearch = require('../views/athleteSearch.jsx');

var CreateAthlete = React.createClass({
    mixins: [Navigation],

    submitForm: function(obj, reset, setErrors) {
        obj.athlete_id = obj.athlete[0].id;
        var oldAthlete = obj.athlete;
        delete obj.athlete;
        this.Service.createStat(obj).then(function(res) {
            if(res.success) {
              var newObj ={
                stattype_id: obj.stattype_id,
                time: obj.time
              };
              if(this.props.query.athleteId) newObj.athlete = oldAthlete;
                reset(newObj);
            }
        }.bind(this));
    },

    componentWillMount: function() {
        this.Service = this.props.Service;

        this.Service.getAthletes().then(function(athletes) {
            this.setState({
                athletes: athletes
            });
        }.bind(this));

        this.Service.getStatTypes().then(function(types) {
           this.setState({
               statTypes: types
           })
        }.bind(this));
    },

    getInitialState: function() {
        return {
            statTypes: [],
            athletes: [],
        };
    },

    render: function () {

        var statTypes = _.map(this.state.statTypes, function(type) {
            return {
                value: type.id,
                label: type.name
            };
        });
        statTypes.unshift({
            value: '',
            label: ''
        });

        var formClassName = 'form-horizontal';

        var sharedProps = {
            layout: 'horizontal',
            validatePristine: false
        };

      var selectedAthlete = null;
        if(this.props.query.athleteId) {
          selectedAthlete = _.find(this.state.athletes, function (athlete) {
            return athlete.id == this.props.query.athleteId;
          }.bind(this));
        }

        return (
            <div className="row">
                <Formsy.Form className={formClassName} onValidSubmit={this.submitForm} ref="form">
                    <fieldset>
                        <legend>Post Stat</legend>
                        <AthleteSearch
                            multi={false}
                            {...sharedProps}
                            name="athlete"
                            label="Athlete"
                            value={selectedAthlete ? [selectedAthlete] : []}
                            //help="Selec"
                            allAthletes={this.state.athletes}
                            required
                            />
                        <Input
                            {...sharedProps}
                            name="time"
                            value={moment().format('YYYY-MM-DD')}
                            label="Stat Date"
                            type="date"
                            placeholder="Enter date stat was observed"
                            required
                            />
                        <Input
                            {...sharedProps}
                            name="value"
                            //value={}
                            label="Stat Value"
                            type="number"
                            placeholder="Enter stat value"
                            required
                            />
                        <Select
                            {...sharedProps}
                            name="stattype_id"
                            value={this.props.query.statTypeId || ""}
                            label="Stat Type"
                            options={statTypes}
                            required
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
