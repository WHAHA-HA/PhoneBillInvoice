'use strict';

var History = require('../history/history.model');
var ce = require('cloneextend');
var db = require('../../components/db')();


exports.index = function (req, res, next) {
  var query = JSON.parse(req.query.filter);

  var knex = db.adapter.query;

  var entity_id = query.where.entity_id['=='],
    entity_type = query.where.entity_type['=='];

  var sql = "SELECT common_history.*, "
    + " \"security_user\".id as user_id, "
    + " \"security_user\".username as username,"
    + " \"security_user\".email as user_email,"
    + " \"security_user\".first_name as user_first_name,"
    + " \"security_user\".last_name as user_last_name,"
    + " \"security_user\".mobile_number as user_mobile_number,"
    + " \"security_user\".avatar as user_avatar,"
    + " \"security_user\".is_active as user_is_active"
    + " from common_history "
    + " inner join \"security_user\" on common_history.created_by = \"security_user\".id "
    + " WHERE (entity_id=" + entity_id + " AND entity_type = '" + entity_type + "') "
    + " OR (parent_id =" + entity_id + " AND parent_entity_type = '" + entity_type + "') ";



  knex.raw(sql)
    .then(function (result) {

      result.rows.forEach(function(instance) {
        //instance = History.createInstance(instance);
       // console.log(instance);
        transform(instance);
      });
      res.send(result.rows);
    }, function (err){
        res.send(err);
    });



};

/**
 * Transform user object
 * @param instance
 */
function transform(instance) {
  instance.user = {
    id: instance.user_id,
    avatar: instance.user_avatar,
    email: instance.user_email,
    first_name: instance.user_first_name,
    last_name: instance.user_last_name,
    is_active: instance.user_is_active,
    mobile_number: instance.user_mobile_number,
    username: instance.username
  };

  delete instance.user_id;
  delete instance.user_avatar;
  delete instance.user_email;
  delete instance.user_first_name;
  delete instance.user_last_name;
  delete instance.user_is_active;
  delete instance.user_mobile_number;
  delete instance.username;
}

/**
 * filter contracts along with sub entities
 * @param req
 * @param res
 * @param next
 */
exports.contracts = function(req, res, next) {

  // query for
  // select * from history where (entity_type='contract_section' and parent_id = 3)
  // or (entity_type='document' and parent_id = 3)
  // or entity_type='contract'

  var knex = db.adapter.query;
  var query = req.query.filter ? JSON.parse(req.query.filter) : {};


  var id = query.id ?  query.id : '';

  var sql = "SELECT * from history " +
    " WHERE (entity_type = 'contract_section' and parent_id = " + id + ")"
    + " or (entity_type = 'document' and parent_id = " + id + ")"
    + " or (entity_type = 'contract' and entity_id =" + id + ")";

  var sql = "SELECT history.*, "
    + " \"user\".id as user_id, "
    + " \"user\".username as username,"
    + " \"user\".email as user_email,"
    + " \"user\".first_name as user_first_name,"
    + " \"user\".last_name as user_last_name,"
    + " \"user\".mobile_number as user_mobile_number,"
    + " \"user\".avatar as user_avatar,"
    + " \"user\".is_active as user_is_active"
    + " from history "
    + " inner join \"user\" on history.created_by = \"user\".id "
    + " WHERE (entity_type = 'contract_section' and parent_id = " + id + " )"
    + " or (entity_type = 'document' and parent_id = " + id + " )"
    + " or (entity_type = 'contract' and entity_id =" + id + ")";

  knex.raw(sql)
    .then(function (result) {

      result.rows.forEach(function(instance) {
        transform(instance);
      });
      res.send(result.rows);
    }, function (err){
        res.send(err);
    });

};


/**
 * filter inventories along with sub entities
 * @param req
 * @param res
 * @param next
 */
exports.inventories = function(req, res, next) {

  var knex = db.adapter.query;
  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  var id = query.id ?  query.id : '';

  /**
   * select history.*,
   "user".id as user_id,
   "user".username as username,
   "user".email as user_email,
   "user".first_name as user_first_name,
   "user".last_name as user_last_name,
   "user".mobile_number as user_mobile_number,
   "user".avatar as user_avatar,
   "user".is_active as user_is_active
   from history
   inner join "user" on history.created_by = "user".id
   where history.entity_type='inventory'
   * @type {string}
   */


  var sql = "SELECT history.*, "
    + " \"user\".id as user_id, "
    + " \"user\".username as username,"
    + " \"user\".email as user_email,"
    + " \"user\".first_name as user_first_name,"
    + " \"user\".last_name as user_last_name,"
    + " \"user\".mobile_number as user_mobile_number,"
    + " \"user\".avatar as user_avatar,"
    + " \"user\".is_active as user_is_active"
    + " from history "
    + " inner join \"user\" on history.created_by = \"user\".id "
    + " WHERE (entity_type = 'inventory_feature' and parent_id = " + id + " )"
    + " or (entity_type = 'inventory_feature' and parent_id = " + id + " )"
    + " or (entity_type = 'inventory_plan' and parent_id = " + id + " )"
    + " or (entity_type = 'inventory_route' and parent_id = " + id + " )"
    + " or (entity_type = 'inventory_underlying_service' and parent_id = " + id + " )"
    + " or (entity_type = 'inventory' and entity_id =" + id + ")";

  knex.raw(sql)
    .then(function (result) {

      result.rows.forEach(function(instance) {
        transform(instance);
      });
      res.send(result.rows);
    }, function (err){
        res.send(err);
    });

};

