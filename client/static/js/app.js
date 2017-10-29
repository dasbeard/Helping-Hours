//==================== Creating Angular App ====================
var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngSanitize', 'ngAnimate', 'ui.mask', 'ngMap', 'ngclipboard', 'ng-weekday-selector']);

//==================== Angular Routes ====================
app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/")

  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "../partials/home.html",
    controller:"homeController"
  })

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
  .state('admin', {
    url: "/admin",
    templateUrl: "../partials/adminPortal.html",
    controller:"logRegController as $lCtrl"
  })
  .state('adminHome', {
    url: "/adminHome",
    templateUrl: "../partials/adminHome.html",
    // controller:"adminController"
    controller:"adminController as $ctrl"

  })

}]);
