/**
 * GET     /accounts              ->  index
 * POST    /accounts              ->  create
 * GET     /accounts/:id          ->  show
 * PUT     /accounts/:id          ->  update
 * DELETE  /accounts/:id          ->  destroy
 */

'use strict';

var Account = require('../account/account.model');
var AccountValidation = require('../account/account.validation');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {
  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  Account.findAllWithPaging(query, {with: ['status', 'vendor']})
    .then(function (result) {
      res.send(result);

    }).catch(next);
};

exports.show = function (req, res, next) {
  Account.find(req.params.id, {with: ['status', 'vendor']})
    .then(function (account) {
      res.send(account);
    })
    .catch(next);
};


exports.create = function (req, res, next) {

  var input = req.body;

  AccountValidation.validateCreateInput(input)
    .then(function () {
      return Account.create(input, {with: ['status', 'vendor']})
        .then(function (account) {
          res.send(account);
        });
    })
    .catch(next);

};

exports.update = function (req, res, next) {

  var input = req.body,
    id = req.params.id;

  AccountValidation.validateUpdateInput(input)
    .then(function () {
      return Account.find(input.id).then(function (account) {
          return extend(account, input);
        })
        .then(function (account) {
          Account.update(id, account, {with: ['status', 'vendor']})
            .then(function (account) {
              res.send(account);
            })
        });

    })
    .catch(next);

};

exports.updateStatus = function (req, res, next) {

    var input = req.body,
        id = req.params.id;
    Account.find(id).then(function (account) {
        account.status_id = input.status_id;
          return account;
        })
        .then(function (account) {
          Account.update(id, account, {with: ['status', 'vendor']})
            .then(function (account) {
              res.send(account);
            });
        })
    .catch(next);

};


exports.delete = function (req, res, next) {

  var input = req.body,
    id = req.params.id;

  Account.find(id)
    .then(function(account) {
      Account.destroy(id, {account: account})
        .then(function () {
          res.status(200).end();
        })
        .catch(next);
    });

};
