'use strict';
var GlString = require('./glstring.model');
var Token = require('../../components/token');

exports.index = function (req, res, next) {
    var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};
    GlString.findAllWithPaging(query, {with:['user', 'glCodesNonVer']})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);
};

exports.show = function (req, res, next) {
    GlString.find(req.params.id, {with:['user', 'glCodesNonVer']})
            .then(function (obj) {
                res.send(obj);
            })
            .catch(next);
};

exports.create = function (req, res, next) {

    var input = req.body;
    input.date_added = new Date();
    var token = Token.get(req);
    input.user_created = token.iss;
    GlString.create(input, {with:['user','glCodesNonVer']})
            .then(function (obj) {
                res.send(obj);
            })
            .catch(next);
};

exports.updateStatus = function (req, res, next) {

    var input = req.body.object;
    GlString.update(input.id, {status: input.status}, {with:['user','glCodesNonVer']})
            .then(function (obj) {
                res.send(obj);
            })
            .catch(next);

};