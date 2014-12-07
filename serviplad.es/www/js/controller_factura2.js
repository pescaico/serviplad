angular.module('starter.controllers')
.controller('NuevaClienteCtrl', function($scope, ClientesService,  mySharedService, $stateParams, $ionicPopup, $timeout, $http, $compile, $state) {
  $scope.contacto = ClientesService.get($stateParams.clienteId);
  $scope.title = "Nueva Cliente";
  //$scope.focusManager = { focusInputOnBlur: true};

     
    var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
    $scope.clientes = data;

  $scope.cliente = {
    fecha : new Date(),
    direccion : "",
    provincia: "",
    ciudad: "",
    dnicif: "",
    telf: "",
    fax: "",
    eamil: "",
    submissions:0,
    summary:"",
    materiales: []
  };

$scope.isOk = function() {
  return $scope.billForm.$valid;
}

$scope.tipoCliente = { placeholder: 'Cliente', address: '1600 Amphitheatre' };
$scope.tipoContacto = { placeholder: 'Contacto', address: '123 Somewhere' };


  $scope.goNewClienteForm = function() {
    mySharedService.prepForBroadcast($scope.cliente);
   $state.go('app.nuevoCliente'); 
 };
 
 $scope.$on('handleBroadcast', function() {
        $scope.message = mySharedService.message;
    });



  $scope.submit = function() {
    $scope.cliente.submissions++;
    $scope.cliente.summary = angular.copy($scope.cliente.nombre) ;
  };
 

 var lineas = 0;

 $scope.removeLinea = function(linea) {
      lineas--;
      $scope.cliente.materiales.splice(linea, 1);
  };
 

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.cliente.materiales.push({nombre:"",
    cantidad:"",
    precio:""});
   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template:     
     '<input type="text" ng-minlength="4" ng-required="true"  ng-model="cliente.materiales['+lineas+'].nombre" placeholder="material">'     
     +'<input type="text" smart-float ng-required="true"  id="linea_cantidad_' + lineas + '" ng-model="cliente.materiales['+lineas+'].cantidad" placeholder="cantidad" >'
     +'<input type="text" smart-float ng-required="false"  id="linea_cantidad_' + lineas + '" ng-model="cliente.materiales['+lineas+'].precio" placeholder="precio unidad">'

     ,
     title: 'Introduce la linea',
     //subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       onTap: function(e) {
           if (!$scope.cliente.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            $scope.cliente.materiales.pop();
            //lineas--;
             return $scope.cliente.materiales;

           }
         } },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.cliente.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            
            var linea = $scope.cliente.materiales[lineas].nombre + ": " +   $scope.cliente.materiales[lineas].cantidad
            + " unidades a " + $scope.cliente.materiales[lineas].precio + " €";
            angular.element(document.getElementById('lineas-cliente')).append(
        $compile(
          "<div class='item item-button-right linea_factura'  id='lineas-cliente"+lineas+"'>"
              + linea
              + "<a remove-on-click-client ng-click='removeLinea("+lineas+")'  id='button-remove-cliente"+lineas+"' "+
              " class='button button-icon icon ion-close-round icon_red'></a>"
            +"</div>")($scope));  
            lineas++;

            
            var total = 0;
            var totalIVA = 0;
            $scope.cliente.materiales.forEach(function(entry) {
              total += entry.precio * entry.cantidad;
            });
            totalIVA = total * 0.21 + total;
            angular.element(document.getElementById('total-factura')).html(total);
            angular.element(document.getElementById('total-factura-IVA')).html(totalIVA);
             return $scope.cliente.materiales;

           }
         }
       },
     ]
   });
  };

})
