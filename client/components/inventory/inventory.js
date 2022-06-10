(function () {
    'use strict';

    var types = [];

    function InventoryTypeFilter() {
        return function (input) {

            return types
                    .filter(function (x) {
                        return x.key === input;
                    })
                    .map(function (x) {
                        return x.value;
                    })
        };

        function findItem(key) {
            for (var i = 0; i < types.length; i++) {
                if (types[i].custom_key) {
                    if (types[i].custom_key = input) {
                        return types[i];
                    }
                } else {
                    if (types[i].value === key) {
                        return types[i];
                    }
                }

            }
        }
    }

    function InventoryVendorFilter(Vendor, ArrayUtil) {
        var cache = {},
                vendors;

        function getValue(input) {

            var vendor = findItem(input);
            return vendor ? vendor.name : '';

        }

        function findItem(key) {
            if (cache[key]) {
                return cache[key];
            }

            cache[key] = "...";

            if (!vendors) {
                Vendor.findAll().then(function (list) {
                    vendors = list;
                    var item = ArrayUtil.find(vendors, {id: key});
                    cache[key] = item;
                })
            } else {
                var item = ArrayUtil.find(vendors, {id: key});
                cache[key] = item;
            }
        }
        getValue.$stateful = true;
        return getValue;
    }

    angular.module('lcma')
            .filter('lcmaInventoryType', InventoryTypeFilter)
            .filter('lcmaInventoryVendor', InventoryVendorFilter)
            ;


}());
