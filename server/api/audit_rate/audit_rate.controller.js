/**
 * Created by bear on 2/26/16.
 */
var AuditRate = require('./audit_rate.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  AuditRate.findAllWithPaging(query)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;

  AuditRate.find(id)
    .then(function (audit_rate) {
      res.send(audit_rate);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  console.log('++++++++++table create', input);
  AuditRate.create(input)
    .then(function (audit_rate) {
      res.send(audit_rate);
    })
    .catch(next);
};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  AuditRate.find(id)
    .then(function (audit_rate) {
      audit_rate = extend(audit_rate, input);
      return AuditRate.update(id, audit_rate);
    })
    .then(function (audit_rate) {
      res.send(audit_rate);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  console.log('Server delete', id);
  AuditRate.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);
};
