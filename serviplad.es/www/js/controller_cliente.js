angular.module('starter.controllers')

.directive("removeOnClickClient", function(){
  return function(scope, element, attrs){
    element.bind("click", function(){
      console.log(attrs.id);
      console.log(element);
      console.log(element.parent());
      var linea = parseInt(element.attr("linea"));
      scope.cliente.materiales.splice(linea, 1);
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

  $scope.lineas = 0;
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
 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.cliente.materiales.push({nombre:"",
    cantidad:"",
    precio:""});
   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-minlength="4" required  ng-model="cliente.materiales['+lineas+'].nombre" placeholder="material">'
     +'<input type="number" maxDecimals="0" min="1" required ng-model="cliente.materiales['+lineas+'].cantidad" placeholder="cantidad">'
     +'<input type="number" maxDecimals="2" ng-model="cliente.materiales['+lineas+'].precio" placeholder="precio">',
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
              + "<button remove-on-click-client  linea ="+linea+" class='button button-assertive' id='button-remove-cliente"+lineas+"'>"
                + "<i class='ion-ios7-close'></i>"
              + "</button>"
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