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

  $scope.showAlertTotal = function(total) {
    var alertPopup = $ionicPopup.alert({
      title: 'Total de pessoas',
      template: 'Total: ' + total
    });
  }

  $scope.newCounter = function () {
    $scope.data = {};
    // An elaborate, custom popup
    var newCounterPop = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="date" ng-model="data.date" placeholder="Dia" /></label><label class="item item-input"> <input type="time" ng-model="data.time" placeholder="Hora" step="300" /></label><div class="list"><label class="item item-input item-select"><div class="input-label">Tipo</div><select ng-model="data.type" ng-init="data.type = \'SOMMA\'"><option value="SOMMA" selected>SOMMA</option><option value="METANOIA" >Metanoia</option><option value="Total" >Total</option><option value="Visitantes">Visitantes</option><option value="Kinder">Kinder</option><option value="Batizados">Batizados</option><option value="Cadeiras">Cadeiras</option></select></label><label class="item item-input"><input type="text" ng-model="data.title" placeholder="Título/Tema"/></label></div>',
      title: 'Novo Contador',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Criar</b>',
          type: 'button-positive',
          onTap: function(e) {
            var nc = BackendService.newCounter($scope.data.date, $scope.data.time.getHours(), $scope.data.time.getMinutes(), $scope.data.type, $scope.data.title);
            nc.success(function(data, status, headers, config) {
              $scope.saveOldCounter();
			  for (var i = 0; i < data.length; i++) {
				  BackendService.newCounterFinish($scope.data.date, data[i].type, data[i].token, data[i].id, data[i].title);
				  BackendService.setIdCounter(data[i].id);
				  BackendService.setValueCounter(0);
				  $scope.getCounters();
				  $scope.$broadcast('newCounter', 0);
				  $scope.$broadcast('nameCounter', data[i].dateEvent.substring(0, 10).split('-').reverse().join('/') + ' - ' + data[i].type);
			  }
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
    var openCounterPop = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="text" placeholder="Digite o código aqui" ng-model="data.token" maxlength="6" style="text-transform:uppercase"></label>',
      title: 'Código do contador',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Abrir</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!BackendService.getCounterToken($scope.data.token.toUpperCase())) {
              var oc = BackendService.openCounter($scope.data.token);
              oc.success(function(data, status, headers, config) {
                $scope.saveOldCounter();
				//data[0].dateEvent = data[0].dateEvent.split('-').reverse().join('/');
                BackendService.newCounterFinish(data.dateEvent, data.type, data.token, data.id, data.title);
                BackendService.setIdCounter(data.id);
                BackendService.setValueCounter(0);
                $scope.getCounters();
                $scope.$broadcast('newCounter', 0);
                $scope.$broadcast('nameCounter', data.dateEvent.substring(0, 10).split('-').reverse().join('/') + ' - ' + data.type);
              }).error(function(data, status, headers, config) {
                $scope.showAlertInvalidCode();
              });
            } else {
              $scope.showAlertInvalidCode();
            }
          }
        }
      ]
    });
  };

   $scope.addValueCounter = function (id) {
    $scope.data = {};
    // An elaborate, custom popup
    var newCounterPop = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="number" ng-model="data.value" placeholder="Total a ser adicionado" /></label>',
      title: 'Adicionar Valor',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Adicionar</b>',
          type: 'button-positive',
          onTap: function(e) {
			total = BackendService.getCounterId(id).value + $scope.data.value;
			BackendService.setAmoutCounterId(id, total);
			$scope.getCounters();
			if (id == BackendService.getIdCounter()) {
				$scope.$broadcast('newCounter', total);
			}
          }
        }
      ]
    });
  };

  $scope.showActionCounter = function(id) {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b>Abrir</b>' },
        { text: 'Adicionar Valor' },
        { text: 'Nova Contagem' },
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
          //$scope.saveOldCounter();
          var newCounter = BackendService.getCounterId(id);
          BackendService.setIdCounter(id);
          BackendService.setValueCounter(newCounter.value);
          $scope.$broadcast('newCounter', newCounter.value);
          $scope.$broadcast('nameCounter', newCounter.date + ' - ' + newCounter.type);
          $ionicSideMenuDelegate.toggleLeft(false);
        } else if (index === 1) {
          //$scope.syncCounter(id);
	        $scope.addValueCounter(id);
        } else if (index === 2) {
          var myPopup = $ionicPopup.show({
            template: 'Caso você opte por realizar uma nova contagem, não será mais possível reverter o valor dessa contagem. Você deseja prosseguir?',
            title: 'Atenção!',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Sim</b>',
                type: 'button-positive',
                onTap: function(e) {
				          BackendService.syncCounter(id);
                  BackendService.setAmoutCounterId(id, 0);
            			if (id == BackendService.getIdCounter()) {
            				$scope.$broadcast('newCounter', 0);
            			}
                  $scope.getCounters();
                }
              }
            ]
          });
        } else if (index === 3) {
          var myPopup = $ionicPopup.show({
            template: 'Caso você opte por Finalizar, não será mais possível adicionar contagens a esse contador. Você deseja prosseguir?',
            title: 'Atenção!',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Sim</b>',
                type: 'button-positive',
                onTap: function(e) {
				          var total = BackendService.syncCounter(id);
                  total.success(function(data, status, headers, config) {
                    $scope.showAlertTotal(data.total);
                  });
                  BackendService.removeCounter(id, 2);
                  var counter = BackendService.getFirstCounter();
                  BackendService.setIdCounter(counter.id || 0);
                  BackendService.setValueCounter(counter.value || 0);
        				  $scope.$broadcast('newCounter', counter.value);
        				  $scope.$broadcast('nameCounter', counter.date + ' - ' + counter.type);
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

  $scope.nameCounter =  "Contador Onda Dura";
  var id = BackendService.getIdCounter();
  if (id) {
    var counter = BackendService.getCounterId(id);
    $scope.nameCounter = counter.date + ' - ' + counter.type;
  }

  $scope.$on('newCounter', function(event, amount) {
    myCounter = new flipCounter('myCounter', {value: amount, inc: interval, auto: false});
  });

  $scope.$on('nameCounter', function(event, name) {
    $scope.nameCounter = name;
  });

  $scope.addCount = function() {
    myCounter.add($rootScope.interval);
    if ($rootScope.vibrationAdd) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setValueCounter($scope.total);
	BackendService.setAmoutCounterId(BackendService.getIdCounter(), $scope.total);
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
