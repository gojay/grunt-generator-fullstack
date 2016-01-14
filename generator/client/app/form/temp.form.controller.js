'use strict';

angular.module('<%= moduleName %>')
	.controller('<%= className %>FormCtrl', <%= className %>FormCtrl);

<%= className %>FormCtrl.$inject = ['$scope', '$state', '$log', '<%= name %>'];

function <%= className %>FormCtrl ($scope, $state, $log, <%= name %>) {
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

<% if(selectOptions.length) { %> 
	/* select options */

	vm.options = <%= JSON.stringify(selectOptions, null, 4) %>;
<% } %><% if(hasDate) { %> 
	/* datepicker */

	vm.opened = false;
	vm.datepicker = {
		minDate: new Date(),
		format: 'dd-MMMM-yyyy', // ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
		options: {
		    formatYear: 'yy',
		    startingDay: 1
	  	},
	  	opened: false,
	  	open: function(event) {
			event.preventDefault();
	      	event.stopPropagation();
			vm.datepicker.opened = true;
	  	},
	  	disabled: function(date, mode) {
		    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  	}
	};
<% } %>
	/* save */

	vm.save = function(form){
		vm.submitted = true;
		if( form.$valid ) {
			vm.loading = true;
			vm.model.$save().then(function success(data) {
				vm.loading = vm.submitted = false;
				$state.go('^.index');
				$log.info('Saved successfuly', '<%= className %>');
			}, function error(data) {
				$log.error('Fail added <%= name %>!', '<%= className %>');
			});
		} 
	}
};
