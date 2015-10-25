angular.module('starter.controllers')

.controller('NuevaNotaCtrl', function($scope, $rootScope,  DataService, $stateParams, $ionicPopup, $timeout, $http, $compile, $state) {
  //$scope.contacto = NotasService.get($stateParams.notaId);
  $scope.title = "Nueva Nota";
  //$scope.focusManager = { focusInputOnBlur: true};

  //var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
  $scope.clientes = DataService.getList().clientes;
  $scope.ciudades = DataService.getList().ciudades;
  $scope.provincias = DataService.getList().provincias;
  $scope.contactos = DataService.getList().contactos;

  $scope.tipoCliente = { placeholder: 'Cliente', required: true, ngMinLength:4, name:'cliente', type:'text'};
  $scope.tipoContacto = { placeholder: 'Contacto',required: false, ngMinLength:4, name:'contacto', type:'text'};
  $scope.tipoCiudad = { placeholder: 'Ciudad', required: true, ngMinLength:4, name:'provincia', type:'text'};
  $scope.tipoProvincia = { placeholder: 'Provincia', required: true, ngMinLength:4, name:'ciudad', type:'text'};

  $scope.lineas = 0;
  $scope.numLineas = 0;



  $scope.isOk = function() {
    return $scope.billForm.$valid;
  }

  $scope.saveAndUpdate = function() {
    alert('go to save');
  }

  $scope.submit = function() {
    $scope.nota.submissions++;
    $scope.nota.summary = angular.copy($scope.nota.nombre) ;
  };

  $scope.goNewClienteForm = function() {
    $state.go('app.nuevoCliente');
  };

  $scope.$on('handleBroadcast', function() {
  });

  $scope.removeLinea = function(linea) {
    delete $scope.nota.materiales[linea];
    $scope.numLineas--;

    $scope.setPastaTotal();
  };

  $scope.setPastaTotal = function() {
    var IVA = 0.21;
    var total = 0;
    var totalIVA = 0;
    var ivaAplicado = 0;
    //$scope.nota.materiales.forEach(function(entry) {
    for (entry  in $scope.nota.materiales) {
      var entity = $scope.nota.materiales[entry];
      total += entity.precio * entity.cantidad;
    }//);
    total = Math.round(total*100)/100;
    ivaAplicado = total * IVA;
    ivaAplicado = Math.round(ivaAplicado*100)/100;
    totalIVA = ivaAplicado + total;
    totalIVA = Math.round(totalIVA*100)/100;
    angular.element(document.getElementById('total-nota')).html(total + "€");
    angular.element(document.getElementById('nota-IVA')).html(ivaAplicado + "€");
    angular.element(document.getElementById('total-nota-IVA')).html(totalIVA + "€");
  }

$scope.showPopup = function() {
   $scope.nota.materiales[$scope.lineas+'a']  = {nombre:"",
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
       if (!$scope.nota.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            //$scope.nota.materiales.pop();
            delete $scope.nota.materiales[$scope.lineas+'a'];
            //lineas--;
            return $scope.nota.materiales;

          }
        } },
        {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.nota.materiales) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
            var key = $scope.lineas+"a";
            var IVA = 0.21;
            var nombre = $scope.nota.materiales[key].nombre;
            var cantidad = $scope.nota.materiales[key].cantidad;
            var precioUnidadSinIVA= $scope.nota.materiales[key].precio;
            var precioUnidadesSinIVA= precioUnidadSinIVA * cantidad;
            precioUnidadesSinIVA = Math.round(precioUnidadesSinIVA*100)/100;
            var precioUnidadConIVA= precioUnidadSinIVA*IVA +precioUnidadSinIVA;
            precioUnidadConIVA = Math.round(precioUnidadConIVA*100)/100;
            var precioUnidadesConIVA= precioUnidadesSinIVA*IVA +precioUnidadesSinIVA;
            precioUnidadesConIVA = Math.round(precioUnidadesConIVA*100)/100;

            var linea = nombre + ": " +   cantidad + " uds a " + precioUnidadSinIVA + " €("+precioUnidadConIVA
              +"€). Total: "+ (precioUnidadesSinIVA) +"€ (con IVA: "+ precioUnidadesConIVA+"€)";
            angular.element(document.getElementById('lineas-nota')).append(
              $compile(
                "<div class='item item-button-right linea_nota'  id='lineas-nota"+$scope.lineas+"'>"
                + linea
                + "<a remove-on-click-client ng-click='removeLinea(\""+key+"\")'  id='button-remove-nota"+$scope.lineas+"' "+
                " class='button button-icon icon ion-close-round icon_red'></a>"
                +"</div>")($scope));
            $scope.lineas++;
            $scope.numLineas++;
            $scope.setPastaTotal();
            return $scope.nota.materiales;

          }
        }
      },
      ]
    });
};
});