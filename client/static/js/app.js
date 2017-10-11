//==================== Creating Angular App ====================
var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngAnimate', 'ui.mask', 'ngMap', 'ngAccordion']);




//==================== Angular Routes ====================
app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/")

  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "../partials/home.html",
    controller:"homeController"
  })
  // ========== same as '/' ==========
  .state('home', {
      url: "/home",
      templateUrl: "../partials/home.html",
      controller:"homeController"
  })
  // ==========  ==========  ==========


  .state('logReg', {
    url: "/logReg",
    templateUrl: "../partials/logReg.html",
    controller:"logRegController"
  })
  .state('edit', {
    url: "/edit",
    templateUrl: "../partials/edit.html",
    controller:"editController"
  })
  .state('organization', {
    url: "/organization/:id",
    templateUrl: "../partials/organization.html",
    controller:"organizationController"
  })

  // ========== for development ==========
  .state('second', {
    url: "/second",
    templateUrl: "../partials/second.html",
    controller:"homeController"
  })
});
