// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(['$provide', function($provide){
        $provide.decorator('$rootScope', ['$delegate', function($delegate){

            Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                value: function(name, listener){
                    var unsubscribe = $delegate.$on(name, listener);
                    this.$on('$destroy', unsubscribe);

                    return unsubscribe;
                },
                enumerable: false
            });


            return $delegate;
        }]);
    }])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.facturas', {
      url: "/facturas",
      views: {
        'menuContent' :{
          templateUrl: "templates/facturas.html",
          controller: 'FacturasCtrl'
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html",
          controller: 'ClientesCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
    //metemos adicionales
    .state('app.contactos', {
      url: "/contactos",
      views: {
        'menuContent' :{
          templateUrl: "templates/contactos.html",
          controller: 'ContactosCtrl'
        }
      }
    })
    .state('app.contacto', {
      url: "/contactos/:contactoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/contacto.html",
          controller: 'ContactoCtrl'
        }
      }
    })
    .state('app.nuevoCliente', {
      url: "/nuevoCliente/",
      views: {
        'menuContent' :{
          templateUrl: "templates/client_form.html",
          controller: 'NuevoClienteCtrl'
        }
      }
    })
    .state('app.nuevaFactura', {
      url: "/nuevaFactura/",
      views: {
        'menuContent' :{
          templateUrl: "templates/bill_form.html",
          controller: 'NuevaFacturaCtrl'
        }
      }
    })
    .state('app.nuevaNota', {
      url: "/nuevaNota/",
      views: {
        'menuContent' :{
          templateUrl: "templates/note_form.html",
          controller: 'NuevaNotaCtrl'
        }
      }
    })
    .state('app.nuevoPresupuesto', {
      url: "/nuevoPresupuesto/",
      views: {
        'menuContent' :{
          templateUrl: "templates/budget_form.html",
          controller: 'NuevoPresupuestoCtrl'
        }
      }
    })
    .state('app.inicio', {
      url: "/inicio/",
      views: {
        'menuContent' :{
          templateUrl: "templates/init.html",
          controller: 'InicioCtrl'
        }
      }
    })

    .state('app.nuevaCliente', {
      url: "/nuevaCliente/",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse_form.html",
          controller: 'NuevaClienteCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/inicio/');
});
