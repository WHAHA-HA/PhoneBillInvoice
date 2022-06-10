'use strict';

var validate = require('validate.js');

function createErrorResponse(err) {
  return {status: 400, errors: err};
}

exports.validateWithCallback = function (resource, scheme, cb) {

  var err = validate(resource, scheme);

  if (err) {
    cb(createErrorResponse(err));
  } else {
    cb(null, resource);
  }
};

exports.validateAsync = function (resource, scheme) {

  return validate.async(resource, scheme, {
    wrapErrors: function (errors) {
      console.log('VALIDATION ERRORS: ', errors);
      return createErrorResponse(errors);
    }
  });
};


exports.validateSync = function (resource, scheme) {

  var err = validate(resource, scheme);
  return err ? createErrorResponse(err) : null;
};

exports.current = validate;
