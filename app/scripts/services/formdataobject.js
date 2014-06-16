'use strict';

angular.module('cmsApp')
  .factory('FormDataObject', function() {
    return function(data) {
      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        fd.append(key, value);
      });
      return fd;
    };
  });
