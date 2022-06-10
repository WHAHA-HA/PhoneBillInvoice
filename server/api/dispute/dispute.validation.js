var validator = require('../../components/validator');

var createScheme = {
  id: {
    numericality: true
  },
  invoice_id: {
    numericality: true,
    presence: true
  },
  user_id: {
    numericality: true,
    presence: true
  },
  status: {
    numericality: true,
    presence: true
  },
  category_id: {
    numericality: true,
    presence: true
  }
};


var updateScheme = {
  id: {
    presence: true,
    numericality: true
  },
  invoice_id: {
    numericality: true,
    presence: true
  },
  user_id: {
    numericality: true,
    presence: true
  },
  status: {
    numericality: true,
    presence: true
  },
  category_id: {
    numericality: true,
    presence: true
  }
};

exports.validateCreateInput = function (input) {

  return validator.validateAsync(input, createScheme);

};

exports.validateUpdateInput = function (input) {

  return validator.validateAsync(input, updateScheme);

};
