'use strict';

var Vendor = require('./vendor.model');
var VendorAlias = require('./vendor-alias.model');

exports.index = function (req, res, next) {
  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  Vendor.findAllWithPaging(query, {with: ['aliases']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {
  Vendor.find(req.params.id)
    .then(function (vendor) {
      res.send(vendor);
    })
    .catch(next);
};


exports.create = function (req, res, next) {

  var input = req.body;

  Vendor.create(input)
    .then(function (vendor) {
      res.send(vendor);
    })
    .catch(next);

};

exports.update = function (req, res, next) {

  var input = req.body,
    id = req.params.id;

  Vendor.update(id, input)
    .then(function (vendor) {
      res.send(vendor);
    })
    .catch(next);

};

exports.assignAlias = function (req, res, next) {

  var query = req.query,
    alias_id = query.alias_id,
    vendor_id = req.params.id;

  VendorAlias.update(alias_id, {
      vendor_id: vendor_id
    })
    .then(function (alias) {
      res.send(alias);
    })
    .catch(next);

};

exports.addAlias = function (req, res, next) {

  var query = req.query,
    alias = query.alias,
    vendor_id = req.params.id;


  VendorAlias.create({
      alias: alias,
      vendor_id: vendor_id
    })
    .then(function (alias) {
      res.send(alias);
    })
    .catch(next);

};

exports.removeAlias = function (req, res, next) {

  var query = req.query,
    alias_id = query.alias_id,
    vendor_id = req.params.id;


  VendorAlias.destroy(alias_id)
    .then(function () {
      res.send({});
    })
    .catch(next);

};


exports.delete = function (req, res, next) {

  var id = req.params.id;

  Vendor.find(id)
    .then(function (vendor) {
      Vendor.destroy(id, {vendor: vendor})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);
    });
};
