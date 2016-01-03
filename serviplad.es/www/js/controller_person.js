angular.module('starter.controllers')
.controller('NuevoClienteCtrl', function($scope, $state, facturaShared, $stateParams, $http, $localstorage, DataService) {
    $scope.title = "Nuevo Cliente";

    $scope.isOk = function() {
        return $scope.clientForm.$valid;
    }

    $scope.saveAndGoBack = function() {
        facturaShared.message.cliente = $scope.cliente;
        facturaShared.prepForBroadcast(facturaShared.message, "");
        saveClient(DataService, $localstorage, facturaShared.message.cliente);
        $state.go('app.nuevaFactura');

    }

    $scope.$on('handleBroadcast', function() {
        console.log('CARGA MÁS FACTURAS!');

        //alert(facturaShared.message.provincia);
        if (facturaShared.type == "cliente") {
            $scope.cliente = facturaShared.message.cliente;
        } else {
            $scope.cliente = facturaShared.message.contacto;
        }
    });
    $scope.cliente = facturaShared.message.cliente;
    $scope.submit = function() {
        $scope.cliente.submissions++;
        $scope.cliente.summary = angular.copy($scope.cliente.nombre);
    }
});