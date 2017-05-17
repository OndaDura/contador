//controllers are packed into a module
angular.module('contador.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, BackendService, $timeout, $ionicSideMenuDelegate) {
  //Disable swipe in menu left and right
  $scope.$on('$ionicView.enter', function() {
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.vabrationAdd = BackendService.getVibrationAdd();
  $rootScope.vibrationAdd = $scope.vabrationAdd;

  $scope.vabrationSubtract = BackendService.getVibrationSubtract();
  $rootScope.vibrationSubtract = $scope.vabrationSubtract;

  $scope.intencity = BackendService.getIntencity();
  $rootScope.intencity = $scope.intencity;

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
    navigator.vibrate(intencity);
  }
})

.controller('CounterCtrl', function($scope, $rootScope, $ionicPopup, BackendService) {
  var start = BackendService.getCounter();
  var myCounter = new flipCounter('myCounter', {value: start, inc: 1, auto: false});

  $scope.addCount = function(qtd) {
    myCounter.add(qtd);
    if ($rootScope.vibrationAdd) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setCounter($scope.total);
  };

  $scope.subtractCount = function(qtd) {
    myCounter.subtract(qtd);
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
