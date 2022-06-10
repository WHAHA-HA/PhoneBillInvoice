/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('apiInterceptor', function apiInterceptor($q, config, $location, $window, $broadcast, $lcmaAuthToken) {
      return {
        'request': function (req) {

          // Only API calls should be affected with authorization token header
          if (req.url.indexOf(config.API_PATH) > -1) {

            var token = $lcmaAuthToken.get();
            if (token) {
              req.headers.Authorization = "Bearer " + token;
            }
          }

          return req || $q.when(req);
        },
        'response': function (response) {
          if (response.status === 403) {
            $broadcast.emit('system:error:403', response);
            return $q.reject(response);
          }

          return response || $q.when(response);
        },
        'responseError': function (response) {

          if (response.status === 403) {
            // This is an unhandled api error response. Notify all.
            $broadcast.emit("system:error:403", response);
          }
          if (response.status === 410) {
            // This is an unhandled api error response. Notify all.
            $broadcast.emit("system:error:403", response);
          }

          if (response.status === 500) {
            // This is an unhandled api error response. Notify all.
            $broadcast.emit("system:error:500", response);
          }

          if (response.status === 401) {
            // This is an forbidden api error response. Notify all.
            $broadcast.emit("system:error:401", response);
          }

          if (response.status === 400) {
            // This is an forbidden api error response. Notify all.
            $broadcast.emit("system:error:400", response);
          }

          if (response.status === 404) {
            // This is bad request api error. Notify all.
            $broadcast.emit("system:error:404", response);
          }

          if (response.status === 502) {
            // This is an gateway or proxy error response. Notify all.
            $broadcast.emit("system:error:502", response);
          }

          return $q.reject(response);
        }
      };
    });

}());
