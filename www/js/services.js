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
    getValueCounter: function() {
      if(window.localStorage.getItem("counter.amount")) {
        return parseInt(window.localStorage.getItem("counter.amount"));
      }
      return 0;
    },
    setValueCounter: function(amount) {
      window.localStorage.setItem("counter.amount", amount);
    },
    getIdCounter: function() {
      if(window.localStorage.getItem("counter.id")) {
        return parseInt(window.localStorage.getItem("counter.id"));
      }
      return 0;
    },
    setIdCounter: function(id) {
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
    newCounter: function(date, hour, minute, type, title) {
      var date = date.toISOString().substring(0, 10).split('-').reverse().join('/');
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }

      hour = hour + ':' + minute;

      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "newCounter", "date": date, "hour": hour, "type": type, "id": window.localStorage.getItem("user.id"), "title": title}
      });
    },
    newCounterFinish: function(date, type, token, id, title) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      if (typeof date != "string") {
        date = date.toISOString();
      }
      counters.push({'date': date.substring(0, 10).split('-').reverse().join('/'), 'type': type, 'value': 0, 'total': 0, 'sync': 1, 'token': token, 'id': id, 'title': title});
      window.localStorage.setItem("counters", JSON.stringify(counters));
    },
    openCounter: function(token) {
      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "openCounter", "token": token}
      });
    },
    getCounters: function() {
      return JSON.parse(localStorage.getItem('counters')) || [];
    },
    removeCounter: function(id, type) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counters.splice(i, 1);
          window.localStorage.setItem("counters", JSON.stringify(counters));
          return $http({
            url: "http://renan.pro.br/ws/admin.php",
            method: "POST",
            data: {"action": "disableCounter", "id": id, "type": type}
          });
        }
      }
    },
    syncCounter: function(id) {
      var amount = 0;
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          amount = counters[i].value;
        }
      }
      return $http({
        url: "http://renan.pro.br/ws/admin.php",
        method: "POST",
        data: {"action": "syncCounter", "id": id, "amount": amount}
      });
    },
    syncCounterFinish: function(id, total) {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counters[i].total = total;
          counters[i].sync = 1;
        }
      }
      window.localStorage.setItem("counters", JSON.stringify(counters));
    },
    getCounterId: function(id) {
      var counter = "";
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          counter = counters[i];
        }
      }
      return counter;
    },
    getCounterToken: function(token) {
      var counter = "";
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].token == token) {
          counter = counters[i];
        }
      }
      return counter;
    },
    getFirstCounter: function() {
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      if (counters.length) {
        return counters[counters.length - 1];
      } else {
        return false;
      }
    },
    setAmoutCounterId: function(id, amount) {
      var counter = "";
      var counters = JSON.parse(localStorage.getItem('counters')) || [];
      for (var i = 0; i < counters.length; i++) {
        if(counters[i].id == id) {
          if (counters[i].value != amount) {
            counters[i].sync = 0;
          }
          counters[i].value = amount;
        }
      }
      window.localStorage.setItem("counters", JSON.stringify(counters));
    }
  }
}])
