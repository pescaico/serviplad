angular.module('starter.controllers')
.directive('smartFloat', function ($filter) {
    var FLOAT_REGEXP_1 = /^\$?\d+(.\d{3})*(\,\d*)?$/; //Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+(,\d{3})*(\.\d*)?$/; //Numbers like: 1,123.56

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (FLOAT_REGEXP_1.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                } else if (FLOAT_REGEXP_2.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', ''));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });

            ctrl.$formatters.unshift(
               function (modelValue) {
                   return $filter('number')(parseFloat(modelValue) , 2);
               }
           );
        }
    };
})

.directive('ionSelect', function($timeout) {
  return {
    restrict: 'EAC',
    scope: {
      label: '@',
      labelField: '@',
      dataselect: '=',
      provider: '=',
      ngModel: '=?',
      ngValue: '=?',
    },
    require: '?ngModel',
    transclude: false,
    replace: false,
    templateUrl: function(scope) {
      if(scope.attr('provider') =='clientes' || scope.attr('provider') =='contactos') {
        return 'templates/t_select_person.html';
      } 
      else{ 
        return 'templates/t_select_simple_data.html';
      }
    },

    link: function(scope, element, attrs, ngModel,state) {
      scope.ngValue = scope.ngValue !== undefined ? scope.ngValue : 'item';
      scope.selecionar = function(item) {
        ngModel.$setViewValue(item);
        scope.showHide = false;
      };
      scope.goNewPerson = function() {
        scope.$parent.goNewClienteForm();
      }

      scope.open = function() {
        scope.ngModel = undefined;
        $timeout(function() {
          return scope.showHide = !scope.showHide;
        }, 100);
      };
      scope.onKeyDown = function() {
        scope.showHide = true;
      };

      scope.$watch('ngModel', function(newValue, oldValue) {
        if (newValue !== oldValue && typeof newValue !== 'undefined') {
          if (scope.showHide === false) {
            element.find('input').val(newValue[scope.labelField]);
          }
        }
        if (!scope.ngModel) {
          scope.showHide = false;
        }
      });
    },
  };
})
.filter('dynamicFilter', ["$filter", function ($filter) {
    return function (array, keyValuePairs) {
        var obj = {}, i;
        for (i = 0; i < keyValuePairs.length; i += 2) {
            if (keyValuePairs[i] && keyValuePairs[i+1]) {
                obj[keyValuePairs[i]] = keyValuePairs[i+1];
            }
        }
        return $filter('filter')(array, obj);
    }
}]);