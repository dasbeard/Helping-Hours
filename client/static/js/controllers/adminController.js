// =========================================================================
// =========================== Admin Controller ================================
// =========================================================================
app.controller('adminController', ['$scope', 'adminFactory', '$location', '$cookies', '$window', '$state', function($scope, adminFactory, $location, $cookies, $window, $state){



  getAllOrgs();

  function getAllOrgs(){
    adminFactory.getAll(function(output){
      $scope.allOrgs = output.data;
    })
  };






}]); // End Controller
