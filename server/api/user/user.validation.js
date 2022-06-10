var validator = require('../../components/validator'),
  User = require('./user.model');

var createScheme = {
  id: {
    numericality: true
  },
  username: {
    uniqueUsername:true,
    presence: true,
    length: {
      minimum: 3,
      maximum: 50
    }
  },
  first_name: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 50
    }
  },
  last_name: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 50
    }
  },
  email: {
    uniqueEmail: true,
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 100
    }
  },
  password_confirm: {
    equality: "password",
    presence: true,
    length: {
      minimum: 3,
      maximum: 100
    }
  }
};

var updateScheme = {
  id: {
    presence: true,
    numericality: true
  },
  email: {
    email: true
  },
  first_name: {
    length: {
      minimum: 2,
      maximum: 50
    }
  },
  last_name: {
    length: {
      minimum: 2,
      maximum: 50
    }
  }
};

validator.current.validators.uniqueUsername = function (value) {
  return new validator.current.Promise(function (resolve, reject) {

    User.findAll({username: value}).then(function (users) {

      if(users.length) {
        resolve('is already taken.');
      }
      else {
        resolve();
      }
    });

  });
};

validator.current.validators.uniqueEmail = function (value) {
  return new validator.current.Promise(function (resolve, reject) {

    User.findAll({email: value}).then(function (users) {

      if(users.length) {
        resolve('is already taken.');
      }
      else {
        resolve();
      }
    });

  });
};

exports.validateCreateInput = function (input) {

  return validator.validateAsync(input, createScheme);

};

exports.validateUpdateInput = function (input) {

  return validator.validateAsync(input, updateScheme);

};
