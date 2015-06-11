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
var Icon = FRC.Icon;

var AthleteListEditor = React.createClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin, ComponentMixin],

    validate: function() {
        if(this.props.multi) {
            return true;
        }
        else {
            return this.getValue().length == 1;
        }
    },
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue: function (event) {
      if(event.trim().length == 0) {
        this.setValue([]);
        return;
      }
        this.setValue(event.split('!|!').map(function(id) {
            id = parseInt(id);
            return _.findWhere(this.props.allAthletes, {
                id: id
            });
        }.bind(this)));
    },

    render: function() {

        var element = this.renderElement();

        if (this.getLayout() === 'elementOnly' || this.props.type === 'hidden') {
            return element;
        }

        var warningIcon = '';
        if (this.showErrors()) {
            warningIcon = (
                <Icon symbol="remove" className="form-control-feedback" />
            );
        }

        return (
            <Row
                label={this.props.label}
                required={this.isRequired()}
                hasErrors={this.showErrors()}
                layout={this.getLayout()}
                >
                {element}
                {warningIcon}
                {this.renderHelp()}
                {this.renderErrorMessage()}
            </Row>
        );
    },

    renderElement: function() {

        var ops = this.props.allAthletes.map(function(athlete) {
            return {
                label: athlete.firstName + ' ' + athlete.lastName + ' (' + athlete.year + ')',
                value: athlete.id
            };
        });

        var cur = this.getValue().map(function(athlete) {
            return {
                label: athlete.firstName + ' ' + athlete.lastName + ' (' + athlete.year + ')',
                value: athlete.id
            };
        });

        return (
            <Select multi={this.props.multi} value={cur} placeholder="Add Team Members" options={ops} delimiter="!|!" onChange={this.changeValue} />
        );
    }
});

module.exports = AthleteListEditor;