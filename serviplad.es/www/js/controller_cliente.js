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
   $state.go('app.nuevoCliente'); 
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
});