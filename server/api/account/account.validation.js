var validator = require('../../components/validator');

var createScheme = {
  id: {
    numericality: true
  },
  account_no: {
    presence: true
  },
  vendor_id: {
    presence: false
  },
  billing_cycle: {
    numericality: true
  }
};

var updateScheme = {
  id: {
    presence: true,
    numericality: true
  },
  account_no: {
    presence: true
  },
  vendor: {
    presence: false
  },
  billing_cycle: {
    numericality: true
  }
};

exports.validateCreateInput = function (input) {

  return validator.validateAsync(input, createScheme);

};

exports.validateUpdateInput = function (input) {

  return validator.validateAsync(input, updateScheme);

};
