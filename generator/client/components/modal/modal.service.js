'use strict';

angular.module('<%= moduleName %>')
  .factory('Modal', Modal);

Modal.$inject = ['$rootScope', '$modal'];

function Modal( $rootScope, $modal ) {
  var modal = {
    confirm: {
      delete: confirmDelete,
      ok: confirmOk
    },
    resource: resource,
    thumb: thumb
  };
  return modal;

  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $modal.open() returns
   */
  function _openModal(scope, modalClass) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';
    // modalClass = 'modal-default';

    var template = scope.modal.template ? { template: scope.modal.template } : { templateUrl: scope.modal.templateUrl };
    var options = angular.extend({
      windowClass: modalClass,
      scope: modalScope,
      size: scope.modal.size || 'md',
      resolve: scope.modal.resolve || {},
      controller: scope.modal.controller || null
    }, template);

    angular.extend(modalScope, scope);

    return $modal.open(options);
  }

  /**
   * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
   * @param  {Function} del - callback, ran when delete is confirmed
   * @return {Function}     - the function to open the modal (ex. myModalFn)
   */
  function confirmDelete(del) {
    del = del || angular.noop;

    /**
     * Open a delete confirmation modal
     * @param  {String} name   - name or info to show on modal
     * @param  {All}           - any additional args are passed staight to del callback
     */
    return function() {
      var args = Array.prototype.slice.call(arguments),
          name = args.shift(),
          deleteModal;

      deleteModal = _openModal({
        modal: {
          templateUrl: 'components/modal/modal.html',
          dismissable: true,
          title: 'Confirm Delete',
          html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
          buttons: [{
            classes: 'btn-danger',
            text: 'Delete',
            click: function(e) {
              deleteModal.close(e);
            }
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              deleteModal.dismiss(e);
            }
          }]
        }
      }, 'modal-danger');

      deleteModal.result.then(function(event) {
        del.apply(event, args);
      }, angular.noop);

      return deleteModal;
    };
  }

  /**
   * Create a function to open a ok confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
   * @param  {Function} del - callback, ran when delete is confirmed
   * @return {Function}     - the function to open the modal (ex. myModalFn)
   */
  function confirmOk(ok) {
    ok = ok || angular.noop;

    /**
     * Open a delete confirmation modal
     * @param  {String} name   - name or info to show on modal
     * @param  {All}           - any additional args are passed staight to ok callback
     */
    return function() {
      var args = Array.prototype.slice.call(arguments),
          name = args.shift(),
          okModal;

      okModal = _openModal({
        modal: {
          templateUrl: 'components/modal/modal.html',
          dismissable: true,
          title: 'Confirm Delete',
          html: '<p>Are you sure you want to <strong>' + name + '</strong> ?</p>',
          buttons: [{
            classes: 'btn-success',
            text: 'Yes',
            click: function(e) {
              okModal.close(e);
            }
          }, {
            classes: 'btn-default',
            text: 'No',
            click: function(e) {
              okModal.dismiss(e);
            }
          }]
        }
      }, 'modal-success');

      okModal.result.then(function(event) {
        ok.apply(event, args);
      }, angular.noop);

      return okModal;
    };
  }

  function resource(options, cbClose, cbCancel) {
    cbClose = cbClose || angular.noop;
    cbCancel = cbCancel || angular.noop;

    return function() {
      var args = Array.prototype.slice.call(arguments),
        title = args.shift();

      var resolveModal = _openModal({
        modal: {
          size: options.size,
          resolve: {
            model: [
              options.resource,
              function (model) {
                return model.get({ id: args[0]._id });
              }
            ]
          },
          controller: ['$scope', 'model', function ($scope, model) {
            $scope.model = model;
          }],
          template: '<div class="modal-header">' +
              '<button type="button" ng-click="$dismiss()" class="close"><i class="fa fa-times"></i></button>' +
              '<h3 class="modal-title text-center">'+ title +'</h3>' +
          '</div>' +
          '<div class="modal-body" style="max-height:500px; overflow-y:scroll">' +
            '<div ng-include="\''+ options.templateUrl +'\'"></div>' +
          '</div>' +
          '<div class="modal-footer">' +
              '<button class="btn btn-default" ng-click="modal.cancel($event)">Close</button>' +
          '</div>',
          close: function(e) {
            resolveModal.close(e);
          },
          cancel: function(e) {
            resolveModal.dismiss(e);
          }
        }
      }, 'modal-primary');

      resolveModal.result.then(function(event) {
        cbClose.apply(event, args);
      }, function(event) {
        cbCancel.apply(event, args);
      });

      return resolveModal;
    }
  }

  function thumb(cbClose, cbCancel) {
    cbClose = cbClose || angular.noop;
    cbCancel = cbCancel || angular.noop;

    return function(title, url) {
      var resolveModal = _openModal({
        modal: {
          size: options.size,
          template: '<div class="modal-header">' +
              '<button type="button" ng-click="$dismiss()" class="close"><i class="fa fa-times"></i></button>' +
              '<h3 class="modal-title text-center">'+ title +'</h3>' +
          '</div>' +
          '<div class="modal-body text-center">' +
            '<img src="'+ url +'" class="img-thumbnail">' +
          '</div>' +
          '<div class="modal-footer">' +
              '<button class="btn btn-default" ng-click="modal.cancel($event)">Close</button>' +
          '</div>',
          close: function(e) {
            resolveModal.close(e);
          },
          cancel: function(e) {
            resolveModal.dismiss(e);
          }
        }
      }, 'modal-primary');

      resolveModal.result.then(function(event) {
        cbClose(event);
      }, function(event) {
        cbCancel(event);
      });

      return resolveModal;
    };
  }
}
