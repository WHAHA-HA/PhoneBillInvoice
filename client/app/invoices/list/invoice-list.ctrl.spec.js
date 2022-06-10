'use strict';

describe('Controller: InvoicesCtrl', function () {

  // load the controller's module
  beforeEach(module('lcma'));

  var InvoicesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InvoicesCtrl = $controller('InvoicesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
