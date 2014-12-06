angular.module('starter.controllers')

.directive("removeOnClickClient", function(){
  return function(scope, element, attrs){
    element.bind("click", function(){
      /*var linea = parseInt(element.attr("linea"));
      scope.cliente.materiales.splice(linea, 1);
      lineas--;*/
      element.parent().remove();
    });
  };
})

.controller('ClientesCtrl', function($scope, ClientesService, $timeout, $http, $state) {
  
  $scope.clientes = [];
  $scope.clientes = ClientesService.allSync(); 
  $scope.title ='Aqui viene el titulo de clientes';
  

  $scope.moreDataCanBeLoaded = function() {
    console.log('MÁS FACTURAS PUEDEN CARGARSE!!');
    return true;//false
  }

  $scope.loadMore = function() {
    console.log('CARGA MÁS FACTURAS!');
    $timeout(function() {
      //AJAX.GET más clientes
      $scope.clientes.push({
        id: 'ttxx',
        nombre: 'PACO VUELVE',
        apellidos: 'cagate lorito'
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.resize')
    }, 1000);
  }

  $scope.callRS = function() {
    //i -> contador, último cliente..
    $http.get('http://localhost:8080/SP-Service/rest/billrs/getbills/'+i).
    success(function(data) {
      $scope.greeting = data;
      alert('data: ' + data);
    });
  }


  $scope.goNewCliente = function() {
   $state.go('app.nuevaCliente'); 
 };

})
.controller('NuevaClienteCtrl', function($scope, ClientesService,  mySharedService, $stateParams, $ionicPopup, $timeout, $http, $compile, $state) {
  $scope.contacto = ClientesService.get($stateParams.clienteId);
  $scope.title = "Nueva Cliente";
  //$scope.focusManager = { focusInputOnBlur: true};

     
    var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
    $scope.clientes = data;

  $scope.cliente = {
    fecha : new Date(),
    direccion : "",
    provincia: "",
    ciudad: "",
    dnicif: "",
    telf: "",
    fax: "",
    eamil: "",
    submissions:0,
    summary:"",
    materiales: []
  };

$scope.isOk = function() {
  return $scope.billForm.$valid;
}

$scope.tipoCliente = { placeholder: 'Cliente', address: '1600 Amphitheatre' };
$scope.tipoContacto = { placeholder: 'Contacto', address: '123 Somewhere' };


  $scope.goNewClienteForm = function() {
    mySharedService.prepForBroadcast($scope.cliente);
   $state.go('app.nuevoCliente'); 
 };
 
 $scope.$on('handleBroadcast', function() {
        $scope.message = mySharedService.message;
    });



  $scope.submit = function() {
    $scope.cliente.submissions++;
    $scope.cliente.summary = angular.copy($scope.cliente.nombre) ;
  };
 

 var lineas = 0;

 $scope.removeLinea = function(linea) {
      lineas--;
      $scope.cliente.materiales.splice(linea, 1);
  };
 

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.cliente.materiales.push({nombre:"",
    cantidad:"",
    precio:""});
   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template:     
     '<input type="text" ng-minlength="4" ng-required="true"  ng-model="cliente.materiales['+lineas+'].nombre" placeholder="material">'     
     +'<input type="text" smart-float ng-required="true"  id="linea_cantidad_' + lineas + '" ng-model="cliente.materiales['+lineas+'].cantidad" placeholder="cantidad" >'
     +'<input type="text" smart-float ng-required="false"  id="linea_cantidad_' + lineas + '" ng-model="cliente.materiales['+lineas+'].precio" placeholder="precio unidad">'

     ,
     title: 'Introduce la linea',
     //subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       onTap: function(e) {
           if (!$scope.cliente.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            $scope.cliente.materiales.pop();
            //lineas--;
             return $scope.cliente.materiales;

           }
         } },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.cliente.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            
            var linea = $scope.cliente.materiales[lineas].nombre + ": " +   $scope.cliente.materiales[lineas].cantidad
            + " unidades a " + $scope.cliente.materiales[lineas].precio + " €";
            angular.element(document.getElementById('lineas-cliente')).append(
        $compile(
          "<div class='item item-button-right linea_factura'  id='lineas-cliente"+lineas+"'>"
              + linea
              + "<a remove-on-click-client ng-click='removeLinea("+lineas+")'  id='button-remove-cliente"+lineas+"' "+
              " class='button button-icon icon ion-close-round icon_red'></a>"
            +"</div>")($scope));  
            lineas++;

            
            var total = 0;
            var totalIVA = 0;
            $scope.cliente.materiales.forEach(function(entry) {
              total += entry.precio * entry.cantidad;
            });
            totalIVA = total * 0.21 + total;
            angular.element(document.getElementById('total-factura')).html(total);
            angular.element(document.getElementById('total-factura-IVA')).html(totalIVA);
             return $scope.cliente.materiales;

           }
         }
       },
     ]
   });
  };

})


.factory('ClientesService', function($q, $timeout) {
  var clientes = [
  { nombre: 'Paco', apellidos:'Pérez Galdós', id: 1 },
  { nombre: 'Pepe', apellidos:'Pérez Caprio', id: 2 },
  { nombre: 'Paca', apellidos:'Pérez Ropber', id: 3 },
  { nombre: 'Pedro', apellidos:'Pérez Nolos', id: 4 },
  { nombre: 'Pablo', apellidos:'Pérez Poblo', id: 5 },
  { nombre: 'Penelope', apellidos:'Pérez Sis', id: 6 }
  ];

  return {
    all: function() {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve(clientes);
      }, 1000);
      return deferred.promise;
    },
    allSync : function() {
      return clientes;
    },  
    get: function(clienteId) {
      // Simple index lookup
      for(var i=0, l=clientes.length; i < l; i++) {
        if(clientes[i].id == clienteId) {
          return clientes[i];
        }
      }
    },
  }
})


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
    template: '<div class="selectContainer">' 
              + '<label class="item item-input-inset">' 
                + '<i class="icon ion-person placeholder-icon"></i>' 
                + '<input type="search" placeholder="{{dataselect.placeholder}}" ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()">'
                +'<label class="button button-icon icon ion-chevron-down" ng-click="open()" ></label>'
                +'<label class="button button-icon icon ion-person-add icon_green" ng-click="goNewPerson()" ></label>'
              + '</label>'  
          + '<div class="optionList padding-left padding-right" ng-show="showHide">' 
            + '<ion-scroll>' 
              + '<ul class="list">' 
                  + '<li class="item" ng-click="selecionar(item)" ng-repeat="item in provider | dynamicFilter:[labelField,ngModel]">{{item[labelField]}}</li>' 
                + '</ul>' 
            + '</ion-scroll>' 
          + '</div>' 
        + '</div>',
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
        if (newValue !== oldValue) {
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
