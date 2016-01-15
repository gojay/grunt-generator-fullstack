'use strict';

angular.module('<%= moduleName %>')
  .service('<%= className %>', <%= className %>Resource);

<%= className %>Resource.$inject = ['$resource'];

function <%= className %>Resource($resource) {
	var resource = $resource('/api/<%= name %>s/:id/:controller', {
      id: '@_id'
    }, {
        query: {
            method: 'GET',
            isArray: true
        },
    	getBasic: {
            method: 'GET',
            isArray: true,
            params: {
                id: 'basic'
            }
        },
        get: {
            method: 'GET',
        },
        getBasicInfo: {
            method: 'GET',
            params: {
                controller: 'basic'
            }
        },
        create: {
            method: 'POST'
        },
        update: {
            method: 'PUT'
        },
        remove: {
            method: 'DELETE'
        }
    });

    // overriding $save instead of $create or $update
    resource.prototype.$save = function() {
        if ( !this._id ) {
            return this.$create();
        }
        else {
            return this.$update();
        }
    };

    return resource;
}