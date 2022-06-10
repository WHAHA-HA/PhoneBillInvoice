/**
 *
 */
(function () {
  'use strict';

  function UserSettingsService($http, $q, Setting, User) {

    function loadAll(key) {

      var user = User.currentUser;

      if (!user) {
        return null;
      }

      var query = {
        where: {
          key: {'===': key}
        }
      };

      return Setting.findAll({filter: JSON.stringify(query)}, {bypassCache: true})
        .then(function (data) {
          return data;
        });
    }

    function load(key) {

      var user = User.currentUser;

      if (!user) {
        return null;
      }

      var query = {
        where: {
          key: {'===': key}
        }
      };

      return Setting.findAll({filter: JSON.stringify(query)}, {bypassCache: true})
        .then(function (data) {

          if (!data.length) {
            return loadDefault(key);
          }

          var current = null;

          if (data.length === 1) {
            current = data[0];
          }
          else if (data.length > 1) {
            // if more than one entry found than search for one defined for current user
            var result = data
              .filter(function (x) {
                return x.user_id === user.id;
              });

            // No results for current user so get first common
            if (!result.length) {
              current = data[0];
            }
            // if only one found than just return this as current
            else if (result.length === 1) {
              current = result[0];
            }
            // if more than one found for the user return one that has is_current=true
            else if (result.length > 1) {

              result = result.filter(function (x) {
                return x.is_current;
              });

              current = result.length ? result[0] : current;
            }
          }
          return current;
        });
    }

    function loadDefault(key) {

      return $http.get('config/setting.json', {
          cache: true
        })
        .then(function (res) {

          var defaultSettings = createInstance(key);

          defaultSettings.name = "System";
          defaultSettings.value = res.data[key];
          defaultSettings.is_default = true;

          return defaultSettings;
        });
    }

    function save(settings) {
      return settings.id
        ? Setting.update(settings.id, {
        id: settings.id,
        name: settings.name,
        user_id: settings.user_id,
        is_current: settings.is_current,
        is_default: settings.is_default,
        key: settings.key,
        value: JSON.stringify(settings.value)
      })
        : Setting.create({
        name: settings.name,
        user_id: settings.user_id,
        is_current: settings.is_current,
        is_default: settings.is_default,
        key: settings.key,
        value: JSON.stringify(settings.value)
      });
    }

    function saveAll(settingsList) {

      var promises = [];

      settingsList.forEach(function (settings) {
        promises.push(save(settings));
      });

      return $q.all(promises);
    }

    function createInstance(key) {
      var instance = Setting.createInstance();
      instance.key = key;
      instance.is_current = false;
      instance.is_default = false;
      instance.user_id = User.currentUser.id;
      instance.value = {};
      return instance;
    }

    function copy(settings) {
      var instance = createInstance(settings.key);
      angular.extend(instance, {
        name: "Untitled",
        user_id: settings.user_id,
        is_current: false,
        is_default: false,
        key: settings.key,
        value: settings.value
      });

      return instance;
    }
    
    function destroy(id){
        return Setting.destroy(id);
    }

    return {
      loadAll: loadAll,
      load: load,
      loadDefault: loadDefault,
      save: save,
      saveAll: saveAll,
      createInstance: createInstance,
      copy: copy,
      destroy: destroy
    };

  }


  function SettingsService(Setting, $http) {

    function load(key, user) {

      var query = {
        where: {
          key: {'===': key}
        }
      };

      return loadDefault(key)
        .then(function (data) {
          return data;
        })
        .then(function (def) {

          var result = [];

          var defaultSettings = {
            name: "Default",
            is_current: true,
            is_default: true,
            value: def
          };


          return Setting.findAll({filter: JSON.stringify(query)})
            .then(function (data) {

              if (!data.length) {
                result.push(defaultSettings);
              }

              var all = result.concat(data);

              // TODO: Calculate which settings is default one
              return all[all.length - 1];
            });
        });

    }

    function loadDefault(key) {

      return $http.get('config/setting.json', {
          cache: true
        })
        .then(function (res) {
          return res.data[key];
        });
    }

    function create(settings) {

      return Setting.create({
        name: settings.name,
        user_id: settings.user_id,
        is_current: settings.is_current,
        is_default: settings.is_default,
        key: settings.key,
        value: JSON.stringify(settings.value)
      });
    }

    function save(settings) {

      return settings.id
        ? Setting.update(settings.id, {
        id: settings.id,
        name: settings.name,
        user_id: settings.user_id,
        is_current: settings.is_current,
        is_default: settings.is_default,
        key: settings.key,
        value: JSON.stringify(settings.value)
      })
        : Setting.create({
        name: settings.name,
        user_id: settings.user_id,
        is_current: settings.is_current,
        is_default: settings.is_default,
        key: settings.key,
        value: JSON.stringify(settings.value)
      });
    }

    function copy(settings) {
      return {
        name: "Untitled",
        user_id: settings.user_id,
        is_current: false,
        is_default: false,
        key: settings.key,
        value: settings.value
      };
    }


    return {
      load: load,
      loadDefault: loadDefault,
      create: create,
      save: save,
      copy: copy
    };

  }

  angular.module('lcma')
    .service('SettingsService', SettingsService)
    .service('UserSettingsService', UserSettingsService)
  ;

}());
