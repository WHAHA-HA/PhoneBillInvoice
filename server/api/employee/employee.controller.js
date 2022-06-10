/**
 * Created by bear on 2/29/16.
 */
var Employee = require('./employee.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  Employee.findAllWithPaging(query, {with: ['status']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Employee.find(id, {with: ['status']})
    .then(function (employee) {
      res.send(employee);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  Employee.create(input, {with: ['status']})
    .then(function (employee) {
      res.send(employee);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  Employee.find(id)
    .then(function (employee) {
      employee = extend(employee, input);
      return Employee.update(id, employee, {with: ['status']});
    })
    .then(function (employee) {
      res.send(employee);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Employee.find(id, {with: ['status']})
    .then(function(employee) {

      Employee.destroy(id, {employee: employee})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);
    });

};
