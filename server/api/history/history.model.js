var db = require('../../components/db')();

var User = require('../user/user.model');
var ce = require('cloneextend');

module.exports = db.store.defineResource({
    name: 'history',
    table: 'common_history',
    add: function (entityType, actionKey, entityId, metaData, parentId, parentEntityType) {
        var userId = User.currentId();
        var defaults = {
          entity_type: entityType,
          entity_id: entityId,
          parent_id: parentId,
          created_at: new Date(),
          created_by: userId,
          action_key: actionKey,
          parent_entity_type: parentEntityType
        };
        var entry = ce.cloneextend(defaults, {
            meta_data: metaData
        });
        this.create(entry);
    },
    relations: {
        belongsTo: {
            user: {
                localField: 'user',
                localKey: 'created_by',
                parent: true
            }
        }
    }
});
