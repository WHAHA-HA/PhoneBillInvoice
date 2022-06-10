(function () {
  'use strict';

  angular.module('lcma')
    .factory('Charge', function (DS) {

      return DS.defineResource({
        name: 'charge',
        computed: {
          address: ['site_a_addr_1', 'site_a_addr_city', 'site_a_addr_zip', 'site_a_addr_st', 'site_a_addr_cntry', function (addr, city, zip, state, country) {
            var sb = '', sep = '';

            if(addr) { sb += sep + addr; sep = ', ' };
            if(city) { sb += sep + city; sep = ', ' };
            if(zip) { sb += sep + zip; sep = ', ' };
            if(state) { sb += sep + state; sep = ', ' };
            if(country) { sb += sep + country; sep = ', ' };
          }]
        },
        actions: {
          filters: {
            method: 'GET'
          }
        }
      });
    });

}());
