/**
 * Created by bear on 2/20/16.
 */
var Contact = require('./contact.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  Contact.findAllWithPaging(query, {with: ['vendor', 'site']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Contact.find(id, {with: ['vendor', 'site']})
    .then(function (contact) {
      res.send(contact);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  Contact.create(input, {with: ['vendor', 'site']})
    .then(function (contact) {
      res.send(contact);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  Contact.find(id)
    .then(function (contact) {
      contact = extend(contact, input);
      return Contact.update(id, contact, {with: ['vendor', 'site']});
    })
    .then(function (contact) {
      res.send(contact);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Contact.find(id)
    .then(function(contact) {
      Contact.destroy(id, {contact: contact})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);
    });

};
