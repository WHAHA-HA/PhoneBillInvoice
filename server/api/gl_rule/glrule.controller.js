'use strict';

var GlRule = require('./glrules.model');
var GlRulesGlCodes = require('./gl_rules_glcodes.model');
var db = require('../../components/db')();
var Promise = require('es6-promise').Promise;


exports.index = function (req, res, next) {
    var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};
    GlRule.findAllWithPaging(query, {with : ["GlRulesGlCodes"]})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.show = function (req, res, next) {
    GlRule.find(req.params.id, {with : ["GlRulesGlCodes"]})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.create = function (req, res, next) {

    var glrule = req.body.gl_rule;
    var gl_rule_glcodes = req.body.gl_rule_glcodes;
    GlRule.create(glrule)
            .then(function (obj) {
                var createPromises = [];
                for (var i in gl_rule_glcodes) {
                    gl_rule_glcodes[i].rule_id = obj.id;
                    createPromises.push(GlRulesGlCodes.create(gl_rule_glcodes[i]));
                }
                Promise.all(createPromises).then(function () {
                    GlRule.find(obj.id, {with : ["GlRulesGlCodes"]})
                            .then(function (result) {
                                res.send(result);
                            });
                });
            })
            .catch(next);
};


exports.delete = function (req, res, next) {
    GlRule.destroy(req.params.id).then(function (obj) {
        GlRulesGlCodes.findAll({where: {
                rule_id: {
                    'in': req.params.id
                }}}).then(function (result) {
            GlRulesGlCodes.destroyAll({
                where: {
                    id: {
                        'in': result.map(function (o) {
                            return o.id;
                        })
                    }
                }})
                    .then(function () {
                        res.sendStatus(200);
                    })
                    .catch(next);
        });
    });
};

exports.update = function (req, res, next) {

    var id = req.params.id;

    var glrule = req.body.gl_rule;
    var gl_rule_glcodes = req.body.gl_rule_glcodes;
    GlRule.update(id, glrule)
            .then(function (obj) {
                GlRulesGlCodes.destroyAll({where: {
                        rule_id: {
                            '==': id
                        }
                    }}).then(function () {
                    var createPromises = [];
                    for (var i in gl_rule_glcodes) {
                        gl_rule_glcodes[i].rule_id = obj.id;
                        createPromises.push(GlRulesGlCodes.create(gl_rule_glcodes[i]));
                    }
                    Promise.all(createPromises).then(function () {
                        GlRule.find(obj.id, {with : ["GlRulesGlCodes"]})
                                .then(function (result) {
                                    res.send(result);
                                });
                    });
                });
            })
            .catch(next);

};