'use strict';

describe('Service: utils', function () {

  // load the service's module
  beforeEach(module('<%= moduleName %>'));

  // instantiate service
  var utils, params;
  beforeEach(inject(function (_utils_) {
    utils = _utils_;
    params = utils.patchListParams({
      page: 1,
      count: 10,
      filter: {
        name: 'John',
        desc: 'hooray'
      },
      sorting: {
        name: 'asc',
        createdAt: 'desc'
      }
    });
  }));

  it('should have parameter page', function () {
    expect(params).toEqual(jasmine.objectContaining({ page: 1 }));
  });

  it('should have parameter limit', function () {
    expect(params).toEqual(jasmine.objectContaining({ limit: 10 }));
  });

  it('should have parameter q', function () {
    expect(params).toEqual(jasmine.objectContaining({ 
      'q[name]': 'John',
      'q[desc]': 'hooray' 
    }));
  });

  it('should have parameter sort', function () {
    expect(params).toEqual(jasmine.objectContaining({ 
      'sort[name]': 'asc',
      'sort[createdAt]': 'desc' 
    }));
  });

});
