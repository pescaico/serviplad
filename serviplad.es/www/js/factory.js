angular.module('starter.controllers')
.factory('facturaShared', function($rootScope) {
    var sharedFacturaService = {};

    sharedFacturaService.message = {
  };
    sharedFacturaService.type = '';

    sharedFacturaService.prepForBroadcast = function(msg, type) {
        this.message = msg;
        this.type = type;
        this.broadcastItem();
    };

    sharedFacturaService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedFacturaService;
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key  ] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])
.factory('DataService', ['$localstorage', function($localstorage) {

  var provinces = typeof $localstorage.get('provincias') === 'undefined'? [] : JSON.parse($localstorage.get('provincias'));
  var cities = typeof $localstorage.get('ciudades') === 'undefined'? [] : JSON.parse($localstorage.get('ciudades'));
  var clients = typeof $localstorage.get('clientes') === 'undefined'? [] : JSON.parse($localstorage.get('clientes'));
  
  var listsData =
  {provincias:provinces,
    ciudades:cities,
    clientes:clients,
    contactos:[]
  }
 return {
  getList: function()    { return listsData}
  };
}]);

