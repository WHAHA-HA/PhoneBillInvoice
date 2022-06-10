'use strict';

var Theme = require('./theme.model');
var Token = require('../../components/token');

exports.index = function (req, res, next) {
    var token = Token.get(req);
    var query = {};
    query.where = {};
    query.where.owner = {'==': null, '|==': token.iss};

    Theme.findAll(query)
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.master = function (req, res, next) {
    var query = {};
    query.where = {};
    query.where.master_theme = {'==': true};

    Theme.findAll(query)
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.create = function (req, res, next) {

    var input = req.body;
    var token = Token.get(req);
    if (input.owner === false) {
        input.owner = null;
    } else {
        input.owner = token.iss;
    }
    input.master_theme = false;
    Theme.create(input)
            .then(function (theme) {
                res.send(theme);
            })
            .catch(next);

};

exports.update = function (req, res, next) {
    var input = req.body,
            id = req.params.id;
     var token = Token.get(req);
    if (input.owner === false) {
        input.owner = null;
    } else {
        input.owner = token.iss;
    }
    input.master_theme = false;
    Theme.update(id, input)
            .then(function (theme) {
                res.send(theme);
            })
            .catch(next);

};