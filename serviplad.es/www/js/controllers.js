angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

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


.controller('NuevoClienteCtrl', function($scope, ContactosService, $stateParams, $http) {
  $scope.contacto = ContactosService.get($stateParams.contactoId);
  $scope.title = "Nuevo Cliente";

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
