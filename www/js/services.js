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
      if(window.localStorage.getItem("counter.vibrationAdd")) {
        return window.localStorage.getItem("counter.vibrationAdd") == "true";
      }
      return false;
    },
    setVibrationAdd: function(vibration) {
      window.localStorage.setItem("counter.vibrationAdd", vibration);
    },
    getVibrationSubtract: function() {
      if(window.localStorage.getItem("counter.vibrationSubtract")) {
        return window.localStorage.getItem("counter.vibrationSubtract") == "true";
      }
      return false;
    },
    setVibrationSubtract: function(vibration) {
      window.localStorage.setItem("counter.vibrationSubtract", vibration);
    },
    getIntencity: function() {
      if(window.localStorage.getItem("counter.intencity")) {
        return parseInt(window.localStorage.getItem("counter.intencity"));
      }
      return 1;
    },
    setIntencity: function(intencity) {
      window.localStorage.setItem("counter.intencity", intencity);
    },
    getCounter: function() {
      if(window.localStorage.getItem("counter.amount")) {
        return parseInt(window.localStorage.getItem("counter.amount"));
      }
      return 0;
    },
    setCounter: function(amount) {
      window.localStorage.setItem("counter.amount", amount);
    }
  }
}])
