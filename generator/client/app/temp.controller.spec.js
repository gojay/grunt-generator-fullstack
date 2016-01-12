'use strict';

describe('Controller: <%= className %>Ctrl', function () {

  // load the controller's module
  beforeEach(module('<%= moduleName %>'));

  var <%= className %>Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    <%= className %>Ctrl = $controller('<%= className %>Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
