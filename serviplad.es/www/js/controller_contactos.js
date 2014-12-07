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
});