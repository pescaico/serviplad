angular.module('starter.controllers')
.controller('NuevoClienteCtrl', function($scope, ContactosService, $state, facturaShared, $stateParams, $http) {


  $scope.isOk = function() {
    return $scope.clientForm.$valid;
  }

  $scope.saveAndGoBack = function() {
    //$window.history.back();
    if ( facturaShared.type == "cliente") {
      facturaShared.message.cliente = $scope.cliente;
    } else {
      facturaShared.message.contacto = $scope.cliente;
    }
    facturaShared.prepForBroadcast(facturaShared.message,"");
    $state.go('app.nuevaFactura');

  }

  $scope.contacto = ContactosService.get($stateParams.contactoId);
  $scope.title = "Nuevo Cliente";
  //$scope.focusManager = { focusInputOnBlur: true};

$scope.$on('handleBroadcast', function() {
        console.log('CARGA MÁS FACTURAS!');

       //alert(facturaShared.message.provincia);
          if ( facturaShared.type == "cliente") {
             $scope.cliente = facturaShared.message.cliente;
    } else {
      $scope.cliente = facturaShared.message.contacto;
    }
    });


  //alert(facturaShared.message.provincia);
  $scope.cliente = {
    nombre : "a",
    primerapellido : "",
    segundoapellido: "",
    direccion : "",
    provincia: "",
    ciudad: "",
    dnicif: "",
    telf: "",
    fax: "",
    eamil: "",
    submissions:0,
    summary:""

  };

$scope.cliente = facturaShared.message.cliente;
  $scope.submit = function() {
    $scope.cliente.submissions++;
    $scope.cliente.summary = angular.copy($scope.cliente.nombre) ;
  }

})
//FACTORIAS
.factory('ContactosService', function($q, $timeout) {
  var contactos = [
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
        deferred.resolve(contactos);
      }, 1000);
      return deferred.promise;
    },
    allSync : function() {
      return contactos;
    },
    get: function(contactoId) {
      // Simple index lookup
      for(var i=0, l=contactos.length; i < l; i++) {
        if(contactos[i].id == contactoId) {
          return contactos[i];
        }
      }
    },
  }
});
