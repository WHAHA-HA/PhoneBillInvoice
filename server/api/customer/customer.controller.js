/**
 * Created by bear on 2/20/16.
 */
var Customer = require('./customer.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  Customer.findAllWithPaging(query)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Customer.find(id)
    .then(function (customer) {
      res.send(customer);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  Customer.create(input)
    .then(function (customer) {
      res.send(customer);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  Customer.find(id)
    .then(function (customer) {
      customer = extend(customer, input);
      return Customer.update(id, customer);
    })
    .then(function (customer) {
      res.send(customer);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Customer.find(id)
    .then(function(customer) {
      Customer.destroy(id, {customer: customer})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);
    });

};
