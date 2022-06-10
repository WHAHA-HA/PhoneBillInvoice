/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('$lcmaSetting', function (Setting) {

      /**
       * get row from gridColSettings
       */

      var getSetting = function(settings, key, user_id) {

        var _setting = _.find(settings, {
          key: key,
          is_default: true,
          user_id: user_id
        });

        // if no default, select global value with user_id = null
        if (!_setting) {
          _setting = _.find( settings, {
            key: key,
            user_id: null
          });
        }

        return _setting;

      };

      /**
       * get array of column from colSetting
       */

      var getCols = function(setting, availableCols) {

        var cols = [];

        _.each(setting.value, function(colObj, field) {

          var col = _.find(availableCols, {field: field});

          if (!col) {
            return;
          }

          var cloneColObj = angular.copy(colObj);

          if (col.name) {
            cloneColObj.name = col.name;
          }

          if (col.type) {
            cloneColObj.type = col.type;
          }

          cloneColObj.field = field;

          cols.push(cloneColObj);

        });

        return cols;

      };

      /**
       * returns collection of setting from Settings table
       */
      var findSettings = function(key, user_id) {

        var query = {
          where: {
            user_id: {
              '==': user_id
            },
            key: {
              '==': key
            }
          }
        };

        return Setting.findAll({filter: JSON.stringify(query)});
      };

      /**
       * Insert the value or update
       */
      var insertOrUpdate = function(obj, key, user_id, value, name, is_default) {

        var row = {
          key: key,
          value: value,
          user_id: user_id,
          is_default: is_default,
          name: name
        };

        if (!obj || !obj.id) {

          //insert code
          return Setting.create(row);

        }
        else {

          return Setting.update(obj.id, row);

        }

      };

      return {
        getSetting: getSetting,
        getCols: getCols,
        findSettings: findSettings,
        insertOrUpdate: insertOrUpdate
      };


    });

}());
