//controllers are packed into a module
angular.module('contador.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, BackendService, $timeout, $ionicSideMenuDelegate, $ionicPopup) {
  //Disable swipe in menu left and right
  $scope.$on('$ionicView.enter', function() {
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.isIOS = function() {
    return ionic.Platform.isIOS() || ionic.Platform.isIPad();
  }

  $scope.vabrationAdd = BackendService.getVibrationAdd();
  $rootScope.vibrationAdd = $scope.vabrationAdd;

  $scope.vabrationSubtract = BackendService.getVibrationSubtract();
  $rootScope.vibrationSubtract = $scope.vabrationSubtract;

  $scope.intencity = BackendService.getIntencity();
  $rootScope.intencity = $scope.intencity;

  $scope.interval = BackendService.getInterval();
  $rootScope.interval = $scope.interval;

  $scope.alterVibrationAdd = function(vibration) {
    BackendService.setVibrationAdd(vibration);
    $rootScope.vibrationAdd = vibration;
  }

  $scope.alterVibrationSubtract = function(vibration) {
    BackendService.setVibrationSubtract(vibration);
    $rootScope.vibrationSubtract = vibration;
  }

  $scope.alterIntencity = function(intencity) {
    BackendService.setIntencity(intencity);
    $rootScope.intencity = parseInt(intencity);
    navigator.vibrate(parseInt(intencity));
  }

  $scope.alterInterval = function(interval) {
    BackendService.setInterval(interval);
    $rootScope.interval = interval;
  }

  $scope.showPopupAdmin = function() {
    $scope.data = {}

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="text" placeholder="Digite seu código aqui" ng-model="data.codigo" maxlength="6" style="text-transform:uppercase"></label>',
      title: 'Código de liderança',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Entrar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.codigo) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              var isLider = BackendService.isCodeAdmin($scope.data.codigo);

              if (isLider != "") {
                $scope.name = isLider;
                $scope.showAlertValidCode();
              } else {
                $scope.showAlertInvalidCode();
              }

            }
          }
        },
      ]
    });
  };

  $scope.showAlertInvalidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Erro ao cadastrar',
      template: 'O código informado é inválido'
    });
  }

  $scope.showAlertValidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Sucesso!',
      template: 'Agora você é um líder'
    });
  }
})

.controller('CounterCtrl', function($scope, $rootScope, $ionicPopup, BackendService) {
  var start = BackendService.getCounter();
  var interval = $rootScope.interval;
  var myCounter = new flipCounter('myCounter', {value: start, inc: interval, auto: false});

  $scope.addCount = function() {
    myCounter.add($rootScope.interval);
    if ($rootScope.vibrationAdd) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setCounter($scope.total);
  };

  $scope.subtractCount = function() {
    myCounter.subtract($rootScope.interval);
    if ($rootScope.vibrationSubtract) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setCounter($scope.total);
  };

  $scope.resetCount = function() {
    var myPopup = $ionicPopup.show({
      title: 'Reiniciar contador',
      subTitle: 'Caso você tenha certeza que deseja reiniciar o contador clique em Sim',
      scope: $scope,
      buttons: [
        { text: 'Não' },
        {
          text: '<b>Sim</b>',
          type: 'button-positive',
          onTap: function(e) {
            myCounter.setValue(0);
            $scope.total = myCounter.getValue();
            BackendService.setCounter($scope.total);
          }
        },
      ]
    });
  };
})
