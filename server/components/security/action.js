/*
var utils = require('../utils'),
  Enum = utils.Enum,
  inherits = utils.inherits;

exports.define = function(args) {
  return new Enum(args);
};
*/


function Action(name, module) {

  this.name = name;
  this.module = module;

}

module.exports = Action;
