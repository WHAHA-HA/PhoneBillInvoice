var validator = require('../../components/validator');

var createScheme = {
  id: {
    numericality: true
  },
  name: {
    presence: true
  }
};


var updateScheme = {
  id: {
    presence: true,
    numericality: true
  },
  name: {
    presence: true
  }
};

exports.validateCreateInput = function (input) {

  return validator.validateAsync(input, createScheme);

};

exports.validateUpdateInput = function (input) {

  return validator.validateAsync(input, updateScheme);

};
