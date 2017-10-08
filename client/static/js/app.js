//==================== Creating Angular App ====================
var app = angular.module('myApp', ['ui.router', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'ui.mask']);




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
  // .state('home', {
  //     url: "/home",
  //     templateUrl: "../partials/home.html",
  //     controller:"homeController"
  // })
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
    controller:"editController"
  })
});






// ======== Used to refresh state to make CSS work properly(MDL) ========
// app.run(function () {
//     var mdlUpgradeDom = false;
//     setInterval(function() {
//       if (mdlUpgradeDom) {
//         componentHandler.upgradeDom();
//         mdlUpgradeDom = false;
//       }
//     }, 160);
//
//     var observer = new MutationObserver(function () {
//       mdlUpgradeDom = true;
//     });
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// });
// =================================================
