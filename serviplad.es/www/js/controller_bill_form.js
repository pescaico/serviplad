angular.module('starter.controllers')

.controller('NuevaFacturaCtrl', function($scope,  DataService, mySharedService, $stateParams, $ionicPopup, $timeout, $http, $compile, $state) {
  //$scope.contacto = FacturasService.get($stateParams.facturaId);
  $scope.title = "Nueva Factura";
  //$scope.focusManager = { focusInputOnBlur: true};

  //var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
  $scope.clientes = DataService.getList().clientes;
  $scope.ciudades = DataService.getList().ciudades;
  $scope.provincias = DataService.getList().provincias;
  $scope.contactos = DataService.getList().contactos;

  $scope.lineas = 0;
  $scope.numLineas = 0;
  $scope.factura = {
    fecha : new Date(),
    direccion : "",
    provincia: "",
    ciudad: "",
    cliente: null,
    contacto: null,
    summary:"",
    materiales: []
  };

  $scope.isOk = function() {
/*
    if($scope.billForm.ciudad.$valid &&
    $scope.billForm.provincia.$valid &&
    $scope.billForm.cliente.$valid &&
    $scope.billForm.contacto.$valid &&
    $scope.billForm.direccion.$valid) {
      //$scope.billForm.$setValidity(true);
    }*/
    
    return $scope.billForm.$valid;
  }

  $scope.saveAndUpdate = function() {
    alert('go to save');
  }


  $scope.tipoCliente = { placeholder: 'Cliente', required: true, ngMinLength:4, name:'cliente', type:'text'};
  $scope.tipoContacto = { placeholder: 'Contacto',required: false, ngMinLength:4, name:'contacto', type:'text'};
  $scope.tipoCiudad = { placeholder: 'Ciudad', required: true, ngMinLength:4, name:'provincia', type:'text'};
  $scope.tipoProvincia = { placeholder: 'Provincia', required: true, ngMinLength:4, name:'ciudad', type:'text'};


  $scope.goNewClienteForm = function() {
    mySharedService.prepForBroadcast($scope.cliente);
    $state.go('app.nuevoCliente'); 
  };

  $scope.$on('handleBroadcast', function() {
    $scope.message = mySharedService.message;
  });

  $scope.submit = function() {
    $scope.factura.submissions++;
    $scope.factura.summary = angular.copy($scope.factura.nombre) ;
  };

  $scope.removeLinea = function(linea) {
    delete $scope.factura.materiales[linea];
    $scope.numLineas--;

    $scope.setPastaTotal();
  };

  $scope.setPastaTotal = function() {
    var IVA = 0.21;
    var total = 0;
    var totalIVA = 0;
    var ivaAplicado = 0;
    //$scope.factura.materiales.forEach(function(entry) {
    for (entry  in $scope.factura.materiales) {
      var entity = $scope.factura.materiales[entry];
      total += entity.precio * entity.cantidad;
    }//);
    total = Math.round(total*100)/100;
    ivaAplicado = total * IVA;
    ivaAplicado = Math.round(ivaAplicado*100)/100;
    totalIVA = ivaAplicado + total;
    totalIVA = Math.round(totalIVA*100)/100;
    angular.element(document.getElementById('total-factura')).html(total);
    angular.element(document.getElementById('factura-IVA')).html(ivaAplicado);
    angular.element(document.getElementById('total-factura-IVA')).html(totalIVA);
  }
          

 // Triggered on a button click, or some other target
$scope.showPopup = function() {
   $scope.factura.materiales[$scope.lineas+'a']  = {nombre:"",
    cantidad:"",
    precio:""};
   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     //template: 't_bill_popup.html',
     templateUrl: 'templates/t_bill_popup.html',
     title: 'Introduce la linea',
     //subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
     { text: 'Cancel',
     onTap: function(e) {
       if (!$scope.factura.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            //$scope.factura.materiales.pop();
            delete $scope.factura.materiales[$scope.lineas+'a'];
            //lineas--;
            return $scope.factura.materiales;

          }
        } },
        {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.factura.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            var key = $scope.lineas+"a";
            var IVA = 0.21;
            var nombre = $scope.factura.materiales[key].nombre; 
            var cantidad = $scope.factura.materiales[key].cantidad;
            var precioUnidadSinIVA= $scope.factura.materiales[key].precio;
            var precioUnidadesSinIVA= precioUnidadSinIVA * cantidad;
            precioUnidadesSinIVA = Math.round(precioUnidadesSinIVA*100)/100;
            var precioUnidadConIVA= precioUnidadSinIVA*IVA +precioUnidadSinIVA;
            precioUnidadConIVA = Math.round(precioUnidadConIVA*100)/100;
            var precioUnidadesConIVA= precioUnidadesSinIVA*IVA +precioUnidadesSinIVA;
            precioUnidadesConIVA = Math.round(precioUnidadesConIVA*100)/100;
            
            var linea = nombre + ": " +   cantidad + " uds a " + precioUnidadSinIVA + " €("+precioUnidadConIVA
              +"€). Total: "+ (precioUnidadesSinIVA) +"€ (con IVA: "+ precioUnidadesConIVA+"€)";
            angular.element(document.getElementById('lineas-factura')).append(
              $compile(
                "<div class='item item-button-right linea_factura'  id='lineas-factura"+$scope.lineas+"'>"
                + linea
                + "<a remove-on-click-client ng-click='removeLinea(\""+key+"\")'  id='button-remove-factura"+$scope.lineas+"' "+
                " class='button button-icon icon ion-close-round icon_red'></a>"
                +"</div>")($scope));  
            $scope.lineas++;
            $scope.numLineas++;
            $scope.setPastaTotal();
            return $scope.factura.materiales;

          }
        }
      },
      ]
    });
};
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
    {nombre: 'Juan', apellidos:' TH E ', id:1},
    {nombre: 'Josh', apellidos:'E H E ', id:2},
    {nombre: 'Juma', apellidos:'ER H E ', id:3},
    {nombre: 'Anto', apellidos:'A H E ', id:4}
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
 