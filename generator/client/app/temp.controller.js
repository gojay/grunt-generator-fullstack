'use strict';

angular.module('<%= moduleName %>')
    .controller('<%= className %>Ctrl', <%= className %>Ctrl);

<%= className %>Ctrl.$inject = ['$scope', '$state', 'ngTableParams', 'Modal', '<%= className %>', 'logger', 'utils'];

function <%= className %>Ctrl($scope, $state, ngTableParams, Modal, <%= className %>, logger, utils) {
    var vm = this;
    vm.<%= name %>s = [];

    vm.edit = edit;

    vm.open = Modal.resource({
        templateUrl: '<%= path %>/show.html',
        resource: '<%= className %>'
    });

    vm.deleteConfirm = Modal.confirm.delete(function(<%= name %>) {
        <%= name %>.$remove(function() {
            logger.success('Success!', 'Delete <%= name %>');
            vm.table.reload();
        }, function(err) {
            logger.error('Error occured!', 'Delete <%= name %>', err);
        });
    });

    /* table params */

    var params = {
        count: 10,
        sorting: {
            created: 'desc'
        }
    };
    vm.table = new ngTableParams(params, {
        total: 0,
        getData: getData,
    });

    function getData($defer, params) {
        vm.loading = true;
        var query = utils.patchListParams(params);
        <%= className %>.query(query, function(<%= name %>s, headers) {
            $defer.resolve(<%= name %>s);
            vm.table.total(headers('X-Pagination-Total-Count'));
            vm.loading = true;
        }, function(err) {
            logger.error('Error occured!', 'Load <%= name %>s', err);
            vm.loading = true;
        });
    }

    function edit(id) {
        $state.go('<%= name %>.edit', { id: id });
    }
}
