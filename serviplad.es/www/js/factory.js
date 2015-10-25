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
.factory('DataService', function() {
  var listsData =
  {provincias:[
    {nombre:'Alicante', id:1},
    {nombre:'Albacete', id:2},
    {nombre:'Madrid', id:14}
    ],
    ciudades:[
    {nombre:'Villena', id:2},
    {nombre:'Caudete', id:4},
    {nombre:'Tres Cantos', id:88}
    ],
    clientes:[
    {nombre: 'Juan', apellidos:' TH E ', id:1, nombreCompleto: 'Juan  (74004106l)'},
    {nombre: 'Josh', apellidos:'E H E ', id:2, nombreCompleto: 'JOSH 2 (74004106l)'},
    {nombre: 'Juma', apellidos:'ER H E ', id:3, nombreCompleto: 'JUMA  THE (74004106l)'},
    {nombre: 'Anto', apellidos:'A H E ', id:4, nombreCompleto: 'Antonio THE (74004106l)'}
    ],
    contactos:[
    {nombre: 'Paco', apellidos:' cholo ', id:1},
    {nombre: 'Pepe', apellidos:'niono', id:2},
    {nombre: 'Pana', apellidos:'bobo ', id:3},
    {nombre: 'Pere', apellidos:'hgo ', id:4}]
  }
 return {
  getList: function() { return listsData}
  };
});

