'use strict';

angular.module('<%= moduleName %>')
  .factory('utils', utils);

function utils() {
  var service = {
    patchListParams: patchListParams,
    intPad: intPad
  };

  return service;

  function patchListParams(ngTableParams) {
    var bpParams = {
      page : ngTableParams.page(),
      limit: ngTableParams.count(),
    };

    _.forIn(ngTableParams.sorting(), function(order, field) {
      var k = 'sort['+ field +']';
      bpParams[k] = order;
    });

    _.forIn(ngTableParams.filter(), function(query, field) {
      if(~field.indexOf(':')) {
        var k = field.replace(':', '');
        bpParams[k] = query;
      } else {
        var k = 'q['+ field +']';
        bpParams[k] = query;
      }
    });

    // _.forIn(ngTableParams.fields, function(query, field) {
    //   bpParams['fields'] = _.isArray(query) ? query.split('|') : query;
    // });

    return bpParams;
  }

  function intPad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}
