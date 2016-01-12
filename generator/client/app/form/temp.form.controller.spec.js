'use strict';

describe('Controller: <%= className %>FormCtrl', function () {

  // load the controller's module
  beforeEach(module('<%= moduleName %>'));

  var <%= className %>FormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    <%= className %>FormCtrl = $controller('<%= className %>FormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
