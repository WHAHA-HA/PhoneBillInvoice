var db = require('../../components/db')();
var validator = require('../../components/validator');
var RoleModel  = require('../role');


var UserInRoleModel = db.store.defineResource({
  name: 'user_in_role',
  table: 'security_user_role_map',
  relations: {
    belongsTo: {
      user: {
        localField: 'user',
        localKey: 'user_id'
      },
      role: {
        localField: 'role',
        localKey: 'role_id'
      }
    }
  }
});
module.exports = UserInRoleModel;
