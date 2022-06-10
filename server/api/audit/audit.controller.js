/**
 *
 */

'use strict';

var Audit = require('../audit/audit.model');

/**
 * GET  /audit ->  index
 */
exports.index = function (req, res, next) {
  var query = JSON.parse(req.query.filter);

  Audit.findAllWithPaging(query, {with: ['user', 'invoice', 'charge', 'account', 'vendor', 'invoice_type']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};


/**
 * GET  /audit ->  show
 */
exports.show = function (req, res, next) {


  Audit.find(req.params.id, {with: ['user', 'invoice', 'charge', 'account', 'vendor', 'invoice_type']})
    .then(function (audit) {
      res.send(audit);
    })
    .catch(next);

};


/**
 * POST  /audit ->  create
 */
exports.create = function (req, res, next) {

  var audit = req.body;

  Audit.create(audit, {with: ['user', 'invoice', 'charge', 'account']})
    .then(function (audit) {
      res.send(audit);
    })
    .catch(next);

};


/**
 * POST  /audit ->  update
 */
exports.update = function (req, res, next) {

  var audit = req.body;

  Audit.update(audit.id, audit, {with: ['user', 'invoice', 'charge', 'account']})
    .then(function (audit) {
      res.send(audit);
    })
    .catch(next);

};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Audit.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);
};