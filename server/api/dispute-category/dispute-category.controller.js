/**
 *
 */

'use strict';

var DisputeCategory = require('../dispute-category/dispute-category.model');
var DisputeCategoryValidation = require('../dispute-category/dispute-category.validation');
var extend = require('cloneextend').cloneextend;

/**
 * GET  /dispute-category ->  index
 */
exports.index = function (req, res, next) {
  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  DisputeCategory.findAll(query)
    .then(function (disputes) {
      res.send(disputes);
    })
    .catch(next);

};


/**
 * GET  /dispute-category ->  show
 */
exports.show = function (req, res, next) {

  console.log('Find dispute category by id ', req.params.id);

  DisputeCategory.find(req.params.id)
    .then(function (dispute) {
      res.send(dispute);
    })
    .catch(next);

};


/**
 * POST  /disputes ->  create
 */
exports.create = function (req, res, next) {

  var category = req.body;

  DisputeCategoryValidation.validateCreateInput(category)
    .then(function () {
      return Dispute.create(category)
        .then(function (disputeCategory) {
          res.send(disputeCategory);
        });
    })
    .catch(next);

};


/**
 * POST  /disputes ->  update
 */
exports.update = function (req, res, next) {

  var input = req.body;

  DisputeCategoryValidation.validateUpdateInput(input)
    .then(function () {

      return Dispute.find(input.id)
        .then(function (category) {
          extend(category, input);
          return Dispute.update(category.id, category)
        })
        .then(function (category) {
          res.send(category);
        });

    })
    .catch(next);

};
