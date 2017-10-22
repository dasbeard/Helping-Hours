// =========================================================================
// =========================== Admin Controller ================================
// =========================================================================
app.controller('adminController', ['$scope', 'adminFactory', '$location', '$cookies', '$window', '$state', function($scope, adminFactory, $location, $cookies, $window, $state){






  function getAllAdmin(){
    adminFactory.getAllAdmin(function(output){
      $scope.allOrgs = output.data;
    })
  };






}]); // End Controller
