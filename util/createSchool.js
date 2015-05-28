var School = require('../models/school');

module.exports = {
  create: function(arg) {
    var school = new School();

    school.city = arg.city;
    school.state = arg.state;
    school.conference = arg.conference;
    school.enrollment = arg.enrollment;
    school.name = arg.name;

    school.save(function(err) {
      if (err) {
        console.log("Error creating school: ");
        console.log(err);
      }

      console.log("Successfully added school: ");
      console.log(school);
    });
  }
};