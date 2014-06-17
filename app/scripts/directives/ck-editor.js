'use strict';

angular.module('cmsApp')
  .directive('ckEditor', function () {
    return {
      require : '?ngModel',
      link : function($scope, elm, attr, ngModel) {
        var ck = window.CKEDITOR.replace(elm[0]);
        ck.config.height = '100%';

        if(!ngModel) {
          return;
        }

        ck.on('pasteState', function() {
          $scope.$apply(function() {
            ngModel.$setViewValue(ck.getData());
          });
        });

        ngModel.$render = function() {
          ck.setData(ngModel.$viewValue);
        };
      }
    };
  });
