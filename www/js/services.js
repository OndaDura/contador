/*

  contador Starter Kit - version 1.1
  Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
  All rights reserved

  written by Mauro Bianchi
  bianchimro@gmail.com

  file: services.js
  description: this file contains all services of the contador app.

*/


angular.module('contador.services', [])
.factory('BackendService', ['$http', function ($http) {

  return {
    getVibrationAdd: function() {
      if(window.localStorage.getItem("config.vibrationAdd")) {
        return window.localStorage.getItem("config.vibrationAdd") == "true";
      }
      return false;
    },
    setVibrationAdd: function(vibration) {
      window.localStorage.setItem("config.vibrationAdd", vibration);
    },
    getVibrationSubtract: function() {
      if(window.localStorage.getItem("config.vibrationSubtract")) {
        return window.localStorage.getItem("config.vibrationSubtract") == "true";
      }
      return false;
    },
    setVibrationSubtract: function(vibration) {
      window.localStorage.setItem("config.vibrationSubtract", vibration);
    },
    getIntencity: function() {
      if(window.localStorage.getItem("config.intencity")) {
        return parseInt(window.localStorage.getItem("config.intencity"));
      }
      return 1;
    },
    setIntencity: function(intencity) {
      window.localStorage.setItem("config.intencity", intencity);
    }
  }
}])
