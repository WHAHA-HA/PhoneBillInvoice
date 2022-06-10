(function () {
    'use strict';

    /**
     * Responsible for managing authorization token.
     * @constructor
     */
    function AuthToken() {
        
        var COOKIE_NAME = 'cloudagesolutions.com';

        this.$get = ['$cookies', '$location',function ($cookies, $location) {
                
           var token = {};
           var AUTH_TOKEN_KEY = $location.$$host;
           
            /**
             * Gets authorization token as string.
             * @returns {*|string}
             */
            token.get = function () {
                var token = $cookies.get(COOKIE_NAME);
                // token is stored as object so need to convert to JSON.
                if(token) {
                    return JSON.parse(token);
                }
            };

            /**
             * Sets authorization token to be used by application.
             * @param value
             * @param expires
             */
            token.set = function (value, expires) {
                // Stringify object and store it in cookie.
                $cookies.put(COOKIE_NAME, JSON.stringify(value), {
                    //expires: expires
                    domain: AUTH_TOKEN_KEY
                });
            };

            /**
             * Removes authorization token from client's storage.
             */
            token.remove = function () {
                $cookies.remove(COOKIE_NAME, {
                    domain: AUTH_TOKEN_KEY
                });
            };

            return token;
        }];
    }

    angular.module('lcma')
        .provider('$lcmaAuthToken', AuthToken);

}());
