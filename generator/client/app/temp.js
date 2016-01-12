'use strict';

angular.module('<%= moduleName %>')
  .config(function ($stateProvider) {
    $stateProvider
      .state('<%= name %>', {
        url: '/<%= name %>s',
        abstract: true,
        templateUrl: 'templates/_base-layout.html',
        ncyBreadcrumb: {
          parent: '<%= name %>.index'
        }
      })
        .state('<%= name %>.index', {
          url: '',
          templateUrl: '<%= path %>/<%= name %>.html',
          controller: '<%= className %>Ctrl',
          controllerAs: 'vm',
          ncyBreadcrumb: { 
            parent: 'dashboard',
            label: '<%= className %>'
          }
        })
        .state('<%= name %>.new', {
          url: '/new',
          templateUrl: '<%= path %>/form/<%= name %>.form.html',
          controller: '<%= className %>FormCtrl',
          controllerAs: 'vm',
        	resolve: {
        		<%= name %>: [ '<%= className %>', function (<%= className %>) {
      				return new <%= className %>();
      			}]
        	},
          ncyBreadcrumb: { 
            label: 'Create'
          }
        })
        .state('<%= name %>.edit', {
          url: '/:id/edit',
          templateUrl: '<%= path %>/form/<%= name %>.form.html',
          controller: '<%= className %>FormCtrl',
          controllerAs: 'vm',
        	resolve: {
            <%= name %>: [ '<%= className %>', '$stateParams', function(<%= className %>, $stateParams) {
            	return <%= className %>.get({ id: $stateParams.id }).$promise;
          	}]
        	},
          ncyBreadcrumb: {
            label: 'Edit {{vm.<%= name %>.name}}'
          }
        });
  });