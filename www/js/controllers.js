//controllers are packed into a module
angular.module('contador.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, BackendService, $timeout, $ionicSideMenuDelegate, $ionicPopup, $ionicActionSheet) {
  //Disable swipe in menu left and right
  $scope.$on('$ionicView.enter', function() {
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  //get default values
  $scope.vabrationAdd = BackendService.getVibrationAdd();
  $rootScope.vibrationAdd = $scope.vabrationAdd;

  $scope.vabrationSubtract = BackendService.getVibrationSubtract();
  $rootScope.vibrationSubtract = $scope.vabrationSubtract;

  $scope.intencity = BackendService.getIntencity();
  $rootScope.intencity = $scope.intencity;

  $scope.interval = BackendService.getInterval();
  $rootScope.interval = $scope.interval;

  $scope.isLeader = BackendService.isLeader();
  $rootScope.isLeader = $scope.isLeader;

  $scope.getCounters = function() {
    $scope.counters = BackendService.getCounters();
  };
  $scope.getCounters();

  $scope.getInfoLeader = function() {
    $scope.id = BackendService.getLeader().id;
    $scope.name = BackendService.getLeader().name;
    $scope.token = BackendService.getLeader().token;
    $scope.active = BackendService.getLeader().active;
    $scope.dateRegister = BackendService.getLeader().dateRegister;

    $rootScope.id = $scope.id;
    $rootScope.name = $scope.name;
    $rootScope.token = $scope.token;
    $rootScope.active = $scope.active;
    $rootScope.dateRegister = $scope.dateRegister;
  };

  if ($scope.isLeader) {
    $scope.getInfoLeader();
  }

  //finish get default values
  $scope.alterVibrationAdd = function(vibration) {
    BackendService.setVibrationAdd(vibration);
    $rootScope.vibrationAdd = vibration;
  };

  $scope.alterVibrationSubtract = function(vibration) {
    BackendService.setVibrationSubtract(vibration);
    $rootScope.vibrationSubtract = vibration;
  };

  $scope.alterIntencity = function(intencity) {
    BackendService.setIntencity(intencity);
    $rootScope.intencity = parseInt(intencity);
    navigator.vibrate(parseInt(intencity));
  };

  $scope.alterInterval = function(interval) {
    BackendService.setInterval(interval);
    $rootScope.interval = interval;
  };

  $scope.removeAdmin = function() {
    var myPopup = $ionicPopup.show({
      template: 'Caso você opte por sair, sua conta será sincronizada e você não será mais adminsitrador, deseja prosseguir?',
      title: 'Atenção!',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Aceito</b>',
          type: 'button-positive',
          onTap: function(e) {
            BackendService.removeAdmin();

            $scope.id = undefined;
            $scope.name = undefined;
            $scope.token = undefined;
            $scope.active = undefined;
            $scope.dateRegister = undefined;
          }
        }
      ]
    });
  };

  $scope.isIOS = function() {
    return ionic.Platform.isIOS() || ionic.Platform.isIPad();
  };

  $scope.showPopupAdmin = function() {
    $scope.data = {};

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
              var isLeader = BackendService.isCodeAdmin($scope.data.codigo);
              isLeader.success(function(data, status, headers, config) {
                if (data.id > 0) {
                  $scope.name = data.name;
                  $scope.showAlertValidCode();
                  BackendService.setLeader(data.id, data.name, data.token, data.active, data.dateRegister);
                } else {
                  $scope.showAlertInvalidCode();
                }
              }).error(function(data, status, headers, config) {
                $scope.showAlertInvalidCode();
              });
            }
          }
        }
      ]
    });
  };

  $scope.showAlertInvalidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Erro ao cadastrar',
      template: 'O código informado é inválido'
    });
  };

  $scope.showAlertValidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Sucesso!',
      template: 'Agora você é um líder'
    });
  };

  $scope.newCounter = function () {
    $scope.data = {};

    // An elaborate, custom popup
    var newCounterPop = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="text" placeholder="Digite o código aqui" ng-model="data.token" maxlength="6" style="text-transform:uppercase"></label>',
      title: 'Código do contador',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Criar</b>',
          type: 'button-positive',
          onTap: function(e) {
            var oc = BackendService.openCounter($scope.data.token);
            oc.success(function(data, status, headers, config) {
              $scope.saveOldCounter();
              BackendService.newCounterFinish($scope.data.date, $scope.data.type, data.token, data.id);
              BackendService.setIdCounter(data.id);
              BackendService.setValueCounter(0);
              $scope.getCounters();
              $scope.$broadcast('newCounter', 0);
            }).error(function(data, status, headers, config) {
              $scope.showAlertInvalidCode();
            });
          }
        }
      ]
    });
  };

  $scope.openCounter = function () {
    $scope.data = {};

    // An elaborate, custom popup
    var newCounterPop = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="date" ng-model="data.date" /></label><div class="list"><label class="item item-input item-select"><div class="input-label">Tipo</div><select ng-model="data.type" ng-init="data.type = \'Total\'"><option value="Total" selected>Total</option><option value="Visitantes">Visitantes</option><option value="Kinder">Kinder</option><option value="Batizados">Batizados</option></select></label></div>',
      title: 'Novo Contador',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Criar</b>',
          type: 'button-positive',
          onTap: function(e) {
            var nc = BackendService.newCounter($scope.data.date, $scope.data.type);
            nc.success(function(data, status, headers, config) {
              $scope.saveOldCounter();
              BackendService.newCounterFinish($scope.data.date, $scope.data.type, data.token, data.id);
              BackendService.setIdCounter(data.id);
              BackendService.setValueCounter(0);
              $scope.getCounters();
              $scope.$broadcast('newCounter', 0);
            }).error(function(data, status, headers, config) {
              $scope.showAlertInvalidCode();
            });
          }
        }
      ]
    });
  };

  $scope.showActionCounter = function(id) {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b>Abrir</b>' },
        { text: 'Sincronizar' },
        { text: 'Finalizar' }
      ],
      destructiveText: 'Excluir',
      cancelText: 'Cancelar',
      destructiveButtonClicked: function() {
        var myPopup = $ionicPopup.show({
          template: 'Caso você opte por Excluir, não será mais possível recuperar os dados do contador, você deseja prosseguir?',
          title: 'Atenção!',
          scope: $scope,
          buttons: [
            { text: 'Cancelar' },
            {
              text: '<b>Sim</b>',
              type: 'button-positive',
              onTap: function(e) {
                BackendService.removeCounter(id, 0);
                var counter = BackendService.getFirstCounter();
                BackendService.setIdCounter(counter.id || 0);
                BackendService.setValueCounter(counter.value || 0);
                $scope.getCounters();
              }
            }
          ]
        });
        return true;
      },
      buttonClicked: function(index) {
        if (index === 0) {
          $scope.saveOldCounter();
          var newCounter = BackendService.getCounterId(id);
          BackendService.setIdCounter(id);
          BackendService.setValueCounter(newCounter.value);
          $scope.$broadcast('newCounter', newCounter.value);
          $ionicSideMenuDelegate.toggleLeft(false);
        } else if (index === 1) {
          $scope.syncCounter(id);
        } else if (index === 2) {
          var myPopup = $ionicPopup.show({
            template: 'Caso você opte por Finalizar, não será mais possível adicionar contagens a esse contador, você deseja prosseguir?',
            title: 'Atenção!',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Sim</b>',
                type: 'button-positive',
                onTap: function(e) {
                  BackendService.removeCounter(id, 2);
                  var counter = BackendService.getFirstCounter();
                  BackendService.setIdCounter(counter.id || 0);
                  BackendService.setValueCounter(counter.value || 0);
                  $scope.getCounters();
                }
              }
            ]
          });
        }
        return true;
      }
    });
  };

  $scope.syncCounter = function(id) {
    $scope.saveOldCounter();
    var total = BackendService.syncCounter(id);
    total.success(function(data, status, headers, config) {
      BackendService.syncCounterFinish(id, data.total);
      $scope.getCounters();
    });
  };

  $scope.saveOldCounter = function() {
    var oldId = BackendService.getIdCounter();
    var oldValue = BackendService.getValueCounter();
    BackendService.setAmoutCounterId(oldId, oldValue);
    $scope.getCounters();
  }
})

.controller('CounterCtrl', function($scope, $rootScope, $ionicPopup, BackendService) {
  var start = BackendService.getValueCounter();
  var interval = $rootScope.interval;
  var myCounter = new flipCounter('myCounter', {value: start, inc: interval, auto: false});

  $scope.$on('newCounter', function(event, amount) {
    myCounter = new flipCounter('myCounter', {value: amount, inc: interval, auto: false});
  });

  $scope.addCount = function() {
    myCounter.add($rootScope.interval);
    if ($rootScope.vibrationAdd) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setValueCounter($scope.total);
  };

  $scope.subtractCount = function() {
    myCounter.subtract($rootScope.interval);
    if ($rootScope.vibrationSubtract) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setValueCounter($scope.total);
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
            BackendService.setValueCounter($scope.total);
          }
        }
      ]
    });
  };
})
