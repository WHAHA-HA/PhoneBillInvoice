/**
 *
 */

'use strict';

var Dispute = require('../dispute/dispute.model');
var History = require('../history/history.model');
var DisputeCharge = require('../dispute/dispute-charge.model');
var User = require('../user/user.model');
var Token = require('../../components/token');
var moment = require('moment');
var Promise = require('es6-promise').Promise;

/**
 * GET  /disputes ->  index
 */
exports.index = function (req, res, next) {
  var query = JSON.parse(req.query.filter);

  Dispute.findAllWithPaging(query, {with: ['user', 'category', 'status', 'invoice', 'invoice.vendor', 'charge.invoice', 'dispute_charge', 'dispute_charge.charge', 'dispute_charge.charge.invoice', 'dictionary']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};


/**
 * GET  /disputes ->  show
 */
exports.show = function (req, res, next) {

  console.log('Find dispute with id ', req.params.id);

  Dispute.find(req.params.id, {with: ['user', 'status', 'invoice', 'dictionary','invoice.vendor', 'category', 'charge.invoice', 'dispute_charge', 'dispute_charge.charge', 'dispute_charge.charge.invoice']})
    .then(function (dispute) {
      res.send(dispute);
    })
    .catch(next);

};


/**
 * POST  /disputes ->  create
 */
exports.create = function (req, res, next) {

  var input = req.body,
    charges = input.charges;

  var token = Token.get(req);

  if (token) {
    input.user_id = token.iss;
  }

  input.created_at = new Date();

  var dispute = {
    user_id: input.user_id,
    created_at: new Date(),
    invoice_id: input.invoice_id,
    category_id: input.category_id,
    content: input.content
  };

  Dispute.create(dispute, {with: ['user', 'invoice', 'invoice.vendor' ,'dispute_charge', 'dispute_charge.charge'], noHistory:true})
    .then(function (dispute) {


     /* // Log history
      Dispute.createHistoryEntry(dispute, 'create', {
        meta_data: {
          invoice_id: input.invoice_id
        }
      }).then(function (history) {
        console.log('History logged: ', history);
      });*/

      dispute.dispute_id = dispute.invoice.vendor.name + '-' + dispute.id;


      Dispute.update(dispute.id, dispute, {with: ['user', 'invoice', 'invoice.vendor', 'dispute_charge', 'dispute_charge.charge'], customHistory:{action:"create"}});

      var disputeChargePromises = [];

      if (charges && charges.length) {
        charges.forEach(function (charge) {

          disputeChargePromises.push(
            DisputeCharge.create({
              dispute_id: dispute.id,
              charge_id: charge.id,
              disputed_amount: charge.disputed_amount,
              description: charge.description,
              resolution_date: charge.resolution_date,
              dispute_value_awarded: charge.dispute_value_awarded,
              dispute_withheld: charge.dispute_withheld,
              status: charge.status || 1
            })
          );

        });
      }

      return Promise.all(disputeChargePromises)
        .then(function () {
          return Dispute.find(dispute.id, {
            with: ['user', 'invoice', 'invoice.vendor', 'category', 'dispute_charge', 'dispute_charge.charge', 'dictionary', 'dispute_charge.charge.invoice']
          })
        })
        .then(function (dispute) {
          res.send(dispute);
        });

    }).catch(next);

};


/**
 * POST  /disputes ->  update
 */
exports.update = function (req, res, next) {

  var dispute = req.body,
    charges = dispute.dispute_charges;
  dispute.disp_stat_dt = new Date();

  Dispute.update(dispute.id, dispute, {with: ['user', 'invoice', 'invoice.vendor', 'dispute_charge', 'dispute_charge.charge']})
    .then(function (dispute) {

      // Log history
    /*  Dispute.createHistoryEntry(dispute, 'update', {
        meta_data: {
          invoice_id: dispute.invoice.id
        }
      });*/

      // Update dispute charges
      var disputeChargePromises = [];

      if (charges && charges.length) {
        charges.forEach(function (charge) {
          disputeChargePromises.push(DisputeCharge.update(charge.id, charge));
        });
      }

      Promise.all(disputeChargePromises)
        .then(function () {
          return Dispute.find(dispute.id, {
            with: ['user', 'invoice', 'invoice.vendor', 'category', 'dispute_charge', 'dispute_charge.charge', 'dispute_charge.charge.invoice', 'dictionary']
          })
        })
        .then(function (dispute) {
          res.send(dispute);
        });


    }).catch(next);

};


/**
 * POST: accepts list of charge id and check any one of them exists in cost_dispute_charge table
 * @param req
 * @param res
 * @param next
 */
exports.isChargesDisputed = function(req,res,next) {

    var query = req.query.filter ? JSON.parse(req.query.filter) : {};


    DisputeCharge.findAllWithPaging(query)
        .then(function (result) {

            if (result.total > 0) {
                res.send({success: false}); //exists
            }
            else {
                res.send({success: true}); //doesn't exist
            }

        })
        .catch(next);
};
