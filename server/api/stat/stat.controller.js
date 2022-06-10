/**
 * GET     /stat              ->  index

 */

'use strict';

var Invoice = require('../invoice/invoice.model'),
  Account = require('../account//account.model'),
  Dispute = require('../dispute/dispute.model');

//var Promise = require('es6-promise').Promise;

// Get list of users
exports.index = function (req, res) {

  var results = {
    id: 999999
  };

  Invoice.findAll({where: {acct_level: {'==': 1}}})
    .then(function (invoices) {
      results.invoices = invoices.length;
      console.log('Invoices stat');
      return Account.findAll();
    }, function() {
      res.send([results]);
    })
    .then(function (accounts) {
      results.accounts = accounts.length;
      console.log('Accounts stat');
      return Dispute.findAll({where: {}});
    }, function() {
      res.send([results]);
    })
    .then(function (disputes) {
      results.disputes = disputes.length;
      console.log('Disputes stat');

      res.send([results]);
    }, function (err) {
      res.send(results);
      console.log(err);
    })
    ;
  /*var disp = Dispute.findAll();
  var acc = Account.findAll();

  console.log(disp);

  Promise.all([acc]).then(function (promises) {
    res.send({

      //invoices: promises[0].length,
      //disputes: promises[1].length,
      accounts: promises[0].length

    }, function () {
        console.log('Error creating stat');
      })
      .catch(function () {
        console.log('Error creating stat');
      });
  });*/
};

