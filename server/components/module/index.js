var AppModule = require('./module');
var definition = require('../../config/modules.json');
module.exports = {
  modules: [],
  init: function (app) {
    var modules = this.modules;

    definition.modules.forEach(function (def) {
      modules.push(new AppModule(def.key, def.title, def.actions, def.properties));
    });

    app.set('modules', modules);
  },
  add: function (key, title) {
    var modules = this.modules;
    modules.push(new AppModule(key, title));
  },
  all: function () {
    var modules = this.modules;
    return modules;
  },
  find: function (key) {
    var modules = this.modules;

    for (var i = 0; i < modules.length; i++) {
      if (modules[i].key === key) {
        return modules[i];
      }
    }
  }
};
