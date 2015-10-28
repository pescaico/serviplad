angular.module('starter.controllers')

.controller('NuevaFacturaCtrl', function($scope, $rootScope, DataService, facturaShared, $stateParams, $ionicPopup, $timeout, $http, $compile, $state) {
    //$scope.contacto = FacturasService.get($stateParams.facturaId);
    $scope.title = "Nueva Factura";
    //$scope.focusManager = { focusInputOnBlur: true};

    //var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
    $scope.clientes = DataService.getList().clientes;
    $scope.ciudades = DataService.getList().ciudades;
    $scope.provincias = DataService.getList().provincias;
    $scope.contactos = DataService.getList().contactos;

    $scope.tipoCliente = {
        placeholder: 'Cliente',
        required: true,
        ngMinLength: 4,
        name: 'cliente',
        type: 'text'
    };

    $scope.tipoCiudad = {
        placeholder: 'Ciudad',
        required: true,
        ngMinLength: 4,
        name: 'provincia',
        type: 'text'
    };
    $scope.tipoProvincia = {
        placeholder: 'Provincia',
        required: true,
        ngMinLength: 4,
        name: 'ciudad',
        type: 'text'
    };

    $scope.lineas = 0;
    $scope.numLineas = 0;

 $scope.setPastaTotal = function() {
        var IVA = 0.21;
        var total = 0;
        var totalIVA = 0;
        var ivaAplicado = 0;
        for (entry in $scope.factura.materiales) {
            var entity = $scope.factura.materiales[entry];
            total += entity.precio * entity.cantidad;
        } //);
        total = Math.round(total * 100) / 100;
        ivaAplicado = total * IVA;
        ivaAplicado = Math.round(ivaAplicado * 100) / 100;
        totalIVA = ivaAplicado + total;
        totalIVA = Math.round(totalIVA * 100) / 100;
        angular.element(document.getElementById('total-factura')).html(total + "€");
        angular.element(document.getElementById('factura-IVA')).html(ivaAplicado + "€");
        angular.element(document.getElementById('total-factura-IVA')).html(totalIVA + "€");
    };

$scope.pintaLinea = function(key) {
        var IVA = 0.21;
        var nombre = $scope.factura.materiales[key].nombre;
                        var cantidad = $scope.factura.materiales[key].cantidad;
                        var precioUnidadSinIVA = $scope.factura.materiales[key].precio;
                        var precioUnidadesSinIVA = precioUnidadSinIVA * cantidad;
                        precioUnidadesSinIVA = Math.round(precioUnidadesSinIVA * 100) / 100;
                        var precioUnidadConIVA = precioUnidadSinIVA * IVA + precioUnidadSinIVA;
                        precioUnidadConIVA = Math.round(precioUnidadConIVA * 100) / 100;
                        var precioUnidadesConIVA = precioUnidadesSinIVA * IVA + precioUnidadesSinIVA;
                        precioUnidadesConIVA = Math.round(precioUnidadesConIVA * 100) / 100;

                        var linea = nombre + ": " + cantidad + " uds a " + precioUnidadSinIVA + " €(" + precioUnidadConIVA + "€). Total: " + (precioUnidadesSinIVA) + "€ (con IVA: " + precioUnidadesConIVA + "€)";
        angular.element(document.getElementById('lineas-factura')).append($compile(
            "<div class='item item-button-right linea_factura'  id='lineas-factura" + $scope.lineas + "'>" + linea + "<a remove-on-click-client ng-click='removeLinea(\"" + key + "\", \"" + $scope.numLineas+ "\")'  id='button-remove-factura" + $scope.lineas + "' " +
            " class='button button-icon icon ion-close-round icon_red'></a>" + "</div>")($scope)); 
        $scope.lineas++;
        $scope.numLineas++;
        $scope.setPastaTotal();
    };


    if (Object.keys(facturaShared.message).length == 0) {
        $scope.factura = {
            fecha: new Date(),
            direccion: "",
            provincia: "",
            ciudad: "",
            cliente: null,
            summary: "",
            materiales: []
        };
    } else {
        $scope.factura = facturaShared.message;
        Object.keys($scope.factura.materiales).forEach(function(key) {
            console.log(key, $scope.factura.materiales[key]);
            $scope.pintaLinea(key);
        });
    }



    $scope.isOk = function() {
        return $scope.billForm.$valid;
    }

    $scope.saveAndUpdate = function() {
        alert('go to save');
        pdfPresupuesto($scope.factura);
    }

    $scope.submit = function() {
        
        //$scope.factura.submissions++;
        //$scope.factura.summary = angular.copy($scope.factura.nombre);
    };

    $scope.goNewClienteForm = function() {
        if ($scope.factura.cliente != null) {
            $scope.factura.cliente.toString = function clienteToString() {
                return $scope.factura.cliente.nombre + " (" + $scope.factura.cliente.dnicif + ") ";
            };
        }

        if ($scope.factura.provincia != null) {
            $scope.factura.provincia.toString = function provinciaToString() {
                return $scope.factura.provincia.nombre;
            };
        }
        if ($scope.factura.provincia != null) {
            $scope.factura.ciudad.toString = function ciudadToString() {
                return $scope.factura.ciudad.nombre;
            };
        }
        facturaShared.prepForBroadcast($scope.factura, "factura");
        $state.go('app.nuevoCliente');
    };

    $scope.$on('handleBroadcast', function() {
        if (Object.keys(facturaShared.message).length != 0) {
            $scope.billForm = facturaShared.message;
        }
    });

    $scope.removeLinea = function(linea, idDiv) {
        delete $scope.factura.materiales[linea];
        angular.element(document.getElementById('button-remove-factura'+idDiv)).parent().remove();
        $scope.numLineas--;


        $scope.setPastaTotal();
    };

    $scope.showPopup = function() {
        $scope.factura.materiales[$scope.lineas + 'a'] = {
            nombre: "",
            cantidad: "",
            precio: ""
        };
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            //template: 't_bill_popup.html',
            templateUrl: 'templates/t_bill_popup.html',
            title: 'Introduce la linea',
            //subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    if (!$scope.factura.materiales) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        //$scope.factura.materiales.pop();
                        delete $scope.factura.materiales[$scope.lineas + 'a'];
                        //lineas--;
                        return $scope.factura.materiales;

                    }
                }
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.factura.materiales) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        var key = $scope.lineas + "a";
                        $scope.pintaLinea(key);
                        return $scope.factura.materiales;

                    }
                }
            }, ]
        });
    };
});