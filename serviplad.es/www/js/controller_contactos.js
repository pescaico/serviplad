angular.module('starter.controllers')
.controller('ContactosCtrl', function($scope, ContactosService, $timeout, $http, $state) {


  $scope.contactos = [];
  $scope.contactos = ContactosService.allSync(); 
  $scope.title ='Aqui viene el titulo de contactos';
  

  $scope.moreDataCanBeLoaded = function() {
    console.log('MORE DATA CAN BE LOADED!');
    return true;//false
  }

  $scope.loadMore = function() {
    console.log('Loading more!');
    $timeout(function() {
      $scope.contactos.push({
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
    $http.get('http://localhost:8080/SP-Service/rest/clientrs/hellojson').
    success(function(data) {
      $scope.greeting = data;
      alert('data: ' + data);
    });
  }


  $scope.goNewClient = function() {
   $state.go('app.nuevoCliente'); 
 };

})

.controller('ContactoCtrl', function($scope, ContactosService, $stateParams, $http) {
  $scope.contacto = ContactosService.get($stateParams.contactoId);
  $scope.title = "Contacto info plus";

  var url = 'http://aktiespillet.co/api/v1/stocks'; 
  $http.get(url).success(function(data) {
    $scope.tableData = data;
    console.log(data);
    
  }).error(function(error) {
    console.log(error);

  });
})
.controller('NuevoClienteCtrl', function($scope, ContactosService, mySharedService, $stateParams, $http) {

  $scope.contacto = ContactosService.get($stateParams.contactoId);
  $scope.title = "Nuevo Cliente";
  //$scope.focusManager = { focusInputOnBlur: true};

  $scope.$on('handleBroadcast', function() {
        console.log('CARGA MÁS FACTURAS!');
        alert(mySharedService.message.provincia);
    });        
  alert(mySharedService.message.provincia);
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