angular.module('starter.controllers')
.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.message = {
    fecha : new Date(),
    direccion : "",
    provincia: "",
    ciudad: "",
    cliente: null,
    contacto: null,
    summary:"",
    materiales: []
  };
    sharedService.type = '';

    sharedService.prepForBroadcast = function(msg, type) {
        this.message = msg;
        this.type = type;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});
