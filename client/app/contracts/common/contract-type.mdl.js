(function () {
  'use strict';

  angular.module('lcma')
    .factory('ContractType', function () {


        var types = [
          {id: 1, value: 'MSA'},
          {id: 2, value: 'Svc Schedule'},
          {id: 3, value: 'SS Amendment'},
          {id: 4, value: 'Svc Order'},
          {id: 5, value: 'Quote'},
          {id: 6, value: 'Supporting Doc'},
          {id: 7, value: 'Settlement Agreement'}
        ];

      function ContractType() {

      }

      ContractType.findAll = function (query) {

        return types;

      };

      ContractType.find = function (id) {
        var result = types.filter(function (x) {
          return x.id == id;
        });

        return result.length ? result[0] : null;
      };

      return ContractType;

    });

}());
