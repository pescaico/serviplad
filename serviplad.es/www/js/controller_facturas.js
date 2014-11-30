angular.module('starter.controllers')



//Directive for adding buttons on click that show an alert on click
.directive("addlineasbutton", function(){
  return {
    restrict: "E",
    template: "<button addbuttons>Click to add buttons</button>"
  }
})
.directive("addbuttons", function($compile){
  return function(scope, element, attrs){
    element.bind("click", function(){
      scope.lineas++;
      angular.element(document.getElementById('lineas-factura')).append(
        $compile(
          "<div class='item item-button-right linea_factura'  id='lineas-factura"+scope.lineas+"'>"
              + "FACTURA"+scope.lineas
              + "<button remove-on-click class='button button-assertive' id='button-remove-factura"+scope.lineas+"'>"
                + "<i class='ion-ios7-close'></i>"
              + "</button>"
            +"</div>")(scope));  
    });
  };
})
.directive("removeOnClick", function(){
  return function(scope, element, attrs){
    element.bind("click", function(){
      console.log(attrs.id);
      console.log(element);
      console.log(element.parent());
      element.parent().remove();
    });
  };
})

//Directive for showing an alert on click
.directive("alert", function(){
  return function(scope, element, attrs){
    element.bind("click", function(){
      console.log(attrs);
      alert("This is alert #"+attrs.alert);
    });
  };
})




.controller('FacturasCtrl', function($scope, FacturasService, $timeout, $http, $state) {
  
  $scope.facturas = [];
  $scope.facturas = FacturasService.allSync(); 
  $scope.title ='Aqui viene el titulo de facturas';
  

  $scope.moreDataCanBeLoaded = function() {
    console.log('MÁS FACTURAS PUEDEN CARGARSE!!');
    return true;//false
  }

  $scope.loadMore = function() {
    console.log('CARGA MÁS FACTURAS!');
    $timeout(function() {
      //AJAX.GET más facturas
      $scope.facturas.push({
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
    //i -> contador, último factura..
    $http.get('http://localhost:8080/SP-Service/rest/billrs/getbills/'+i).
    success(function(data) {
      $scope.greeting = data;
      alert('data: ' + data);
    });
  }


  $scope.goNewBill = function() {
   $state.go('app.nuevaFactura'); 
 };

})
.controller('NuevaFacturaCtrl', function($scope, FacturasService, $stateParams, $http) {
  $scope.contacto = FacturasService.get($stateParams.facturaId);
  $scope.title = "Nueva Factura";
  //$scope.focusManager = { focusInputOnBlur: true};

  $scope.lineas = 0;
  $scope.factura = {
    fecha : new Date(),
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
    $scope.factura.submissions++;
    $scope.factura.summary = angular.copy($scope.factura.nombre) ;
  };
})
.factory('FacturasService', function($q, $timeout) {
  var facturas = [
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
        deferred.resolve(facturas);
      }, 1000);
      return deferred.promise;
    },
    allSync : function() {
      return facturas;
    },  
    get: function(facturaId) {
      // Simple index lookup
      for(var i=0, l=facturas.length; i < l; i++) {
        if(facturas[i].id == facturaId) {
          return facturas[i];
        }
      }
    },
  }
})