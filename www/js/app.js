/*

  contador Starter Kit - version 1.1
  Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
  All rights reserved

  written by Mauro Bianchi
  bianchimro@gmail.com

  file: app.js

*/

angular.module('contador', ['ionic', 'contador.controllers', 'contador.services'])

.run(function($ionicPlatform, $rootScope, $timeout, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /*
      #SIMPLIFIED-IMPLEMENTATION:
      Example access control.
      A real app would probably call a service method to check if there
      is a logged user.

      #IMPLEMENTATION-DETAIL: views that require authorizations have an
      "auth" key with value = "true".
    */
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
      }
    );
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app.counter', {
    url: '/counter',
    views: {
      'menuContent': {
        templateUrl: 'templates/counter.html',
        controller : 'CounterCtrl'
      }
    }
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/counter');

});
