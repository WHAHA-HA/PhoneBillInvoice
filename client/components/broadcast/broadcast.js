(function () {
    'use strict';

    /**
     * $broadcast provider used for broadcast message information across the application.
     * Including:
     *   $rootScope
     *
     *   @example
     *   $broadcast.info('profile:created', {name: 'Andrej'});
     *
     *   $broadcast.on('profile:created', function(val) {
     *      console.log(val.name)   // => Andrej
     *   })
     */
    angular.module('lcma')
        .provider('$broadcast', function () {

            this.$get = function ($rootScope) {
                function emit(key, value) {
                    $rootScope.$broadcast(key, value);
                }

                function on(key, fn) {
                    var e = $rootScope.$on(key, fn);
                    return e;
                }

                return {
                    emit: emit,
                    on: on
                };
            };
        }
    );
})();
