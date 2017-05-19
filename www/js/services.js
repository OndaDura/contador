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
    },
    getCounterId: function() {
      if(window.localStorage.getItem("counter.id")) {
        return parseInt(window.localStorage.getItem("counter.id"));
      }
      return 0;
    },
    setCounterId: function(id) {
      window.localStorage.setItem("counter.id", id);
    },
    getInterval: function() {
      if(window.localStorage.getItem("counter.interval")) {
        return parseInt(window.localStorage.getItem("counter.interval"));
      }
      return 1;
    },
    setInterval: function(interval) {
      window.localStorage.setItem("counter.interval", interval);
    },
    isCodeAdmin: function(code) {
      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "token", "token": code}
      });
    },
    isLeader: function() {
      return !!window.localStorage.getItem("user.token");
    },
    getLeader: function() {
      return {
        'id': window.localStorage.getItem("user.id"),
        'name': window.localStorage.getItem("user.name"),
        'token': window.localStorage.getItem("user.token"),
        'active': window.localStorage.getItem("user.active"),
        'dateRegister': window.localStorage.getItem("user.dateRegister")
      };
    },
    setLeader: function(id, name, token, active, dateRegister) {
      window.localStorage.setItem("user.id", id);
      window.localStorage.setItem("user.name", name);
      window.localStorage.setItem("user.token", token);
      window.localStorage.setItem("user.active", active);
      window.localStorage.setItem("user.dateRegister", dateRegister);
    },
    removeAdmin: function() {
      $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "removeAdmin", "token": window.localStorage.getItem("user.token")}
      }).success(function(data, status, headers, config) {
        if (data.ok == true) {
          localStorage.removeItem("user.id");
          localStorage.removeItem("user.name");
          localStorage.removeItem("user.token");
          localStorage.removeItem("user.active");
          localStorage.removeItem("user.dateRegister");
        }
      });
    },
    newCounter: function(date, type) {
      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "newCounter", "date": date.toISOString().substring(0, 10).split('-').reverse().join('/'), "type": type, "id": window.localStorage.getItem("user.id")}
      });
    },
    newCounterFinish: function(date, type, token, id) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      counters.push({'date': date.toISOString().substring(0, 10).split('-').reverse().join('/'), 'type': type, 'value': 0, 'total': 0, 'token': token, 'id': id});
      window.localStorage.setItem("counters", JSON.stringify(counters));
    },
    getCounters: function() {
      return JSON.parse(localStorage.getItem('counters')) || [];
    },
    removeCounter: function(id) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counters.splice(i, 1);
          window.localStorage.setItem("counters", JSON.stringify(counters));
          return $http({
            url: "http://renan.pro.br/ws/admin.php",
            method: "POST",
            data: {"action": "disableCounter", "id": id}
          });
        }
      }
    },
    syncCounter: function(id) {
      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "syncCounter", "id": id, "amount": parseInt(window.localStorage.getItem("counter.amount"))}
      });
    },
    syncCounterFinish: function(id, total) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counters[i].value = parseInt(window.localStorage.getItem("counter.amount"));
          counters[i].total = total;
        }
      }
      window.localStorage.setItem("counters", JSON.stringify(counters));
    },
    getCounterIdArray: function(id) {
      var counter = "";
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counter = counters[i];
        }
      }
      return counter;
    }
  }
}])
