(function () {
  'use strict';

  function DialogProvider() {

    this.$get = ['$uibModal', function ($uibModal) {

      var locals = {
        buttonYesText: 'Yes',
        buttonNoText: 'No',
        buttonCloseText: 'Close'
      };

      var alertDefaults = {
        templateUrl: 'components/dialog/dialog-alert.html',
        controller: 'LcmaDialogAlertCtrl'
      };

      var confirmDefaults = {
        templateUrl: 'components/dialog/dialog-confirm.html',
        controller: 'LcmaDialogConfirmCtrl',
        size: 'sm'
      };

      var promptDefaults = {
        templateUrl: 'components/dialog/dialog-prompt.html',
        controller: 'LcmaDialogPromptCtrl',
        size: 'md'
      };

       var dateDefaults = {
        templateUrl: 'components/dialog/dialog-date.html',
        controller: 'LcmaDialogDateCtrl',
        windowClass: 'app-modal-window-340'
      };

      var customDefaults = {};

      function alert(options) {

        var settings = angular.merge({backdrop: 'static'}, alertDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function open(options) {
        var settings = angular.extend({backdrop: 'static'}, customDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function confirm(options) {
        var settings = angular.extend({backdrop: 'static'}, confirmDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function remove(options) {
        var defaultMessages = {
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove'+options.message+'?'
            };
        var settings = angular.extend({backdrop: 'static'},confirmDefaults,   defaultMessages);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, defaultMessages);
        };

        return $uibModal.open(settings);
      }

      function prompt(options) {
        var settings = angular.extend({backdrop: 'static'}, promptDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function date(options) {
        var settings = angular.extend({backdrop: 'static'}, dateDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      return {
        alert: alert,
        open: open,
        confirm: confirm,
        remove: remove,
        prompt: prompt,
        date: date
      };
    }];
  }

  function DialogAlertCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;

    $scope.close = function () {
      $uibModalInstance.close();
    };

  }

  function DialogConfirmCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;

    $scope.yes = function () {
      $uibModalInstance.close(true);
    };

    $scope.no = function () {
      $uibModalInstance.dismiss(false);
    };
  }

  function LcmaDialogPromptCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;

    $scope.yes = function () {
      $uibModalInstance.close($scope.note);
    };

    $scope.no = function () {
      $uibModalInstance.dismiss(false);
    };
  }

   function LcmaDialogDateCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;
    $scope.date = new Date();

    $scope.yes = function () {
      $uibModalInstance.close($scope.date);
    };

    $scope.no = function () {
      $uibModalInstance.dismiss(false);
    };
  }

  angular.module('lcma')
    .provider('$lcmaDialog', DialogProvider)
    .controller('LcmaDialogAlertCtrl', DialogAlertCtrl)
    .controller('LcmaDialogConfirmCtrl', DialogConfirmCtrl)
    .controller('LcmaDialogPromptCtrl', LcmaDialogPromptCtrl)
    .controller('LcmaDialogDateCtrl', LcmaDialogDateCtrl)
  ;
}());
