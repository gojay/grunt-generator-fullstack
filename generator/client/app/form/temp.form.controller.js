'use strict';

angular.module('<%= moduleName %>')
	.controller('<%= className %>FormCtrl', <%= className %>FormCtrl);

<%= className %>FormCtrl.$inject = ['$scope', '$state', '$timeout', 'logger', '<%= name %>'];

function <%= className %>FormCtrl ($scope, $state, $timeout, logger, <%= name %>) {
	var vm = this;
	vm.loading = false;
	vm.model = <%= name %>;

	/* validation */

	vm.submitted = false;

	vm.getFormClass = function(field) {
		if(field.$dirty || vm.submitted) return field.$valid ? 'has-success' : 'has-error' ;
		return null;
	};

	vm.isInteracted = function(field) {
  		return vm.submitted || field.$dirty;
	};

	/* save */

	vm.save = function(form){
		vm.submitted = true;
		if( form.$valid ) {
			vm.loading = true;
			vm.model.$save().then(function success(data) {
				vm.loading = vm.submitted = false;
				$state.go('^.index');
				logger.success('Saved successfuly', '<%= className %>');
			}, function error(data) {
				logger.error('Fail added <%= name %>!', '<%= className %>');
			});
		} 
	}
};
