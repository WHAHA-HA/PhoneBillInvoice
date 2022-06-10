var Ticket = require('./ticket.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  Ticket.findAllWithPaging(query,{with: ['assignee', 'type']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Ticket.find(id, {with: ['assignee', 'type']})
    .then(function (ticket) {
      res.send(ticket);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  // TODO: Add validation

  Ticket.create(input, {with: ['assignee', 'type']})
    .then(function (ticket) {
      res.send(ticket);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation


  Ticket.find(id, {with: ['assignee', 'type']})
    .then(function (ticket) {
      ticket = extend(ticket, input);
      return Ticket.update(id, ticket, {with: ['assignee', 'type']});
    })
    .then(function (ticket) {

      res.send(ticket);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Ticket.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);

};
