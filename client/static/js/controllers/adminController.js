// =========================================================================
// =========================== Admin Controller ================================
// =========================================================================
app.controller('adminController', ['$scope', 'adminFactory', '$location', '$cookies', '$window', '$state', function($scope, adminFactory, $location, $cookies, $window, $state){

  if ($cookies.getObject('loggedUser')){
    $scope.loggedInUser = $cookies.getObject('loggedUser');
      getAllAdmin();
  } else{
    window.location.replace('/');
  };



  function getAllAdmin(){
    adminFactory.getAllAdmin(function(output){
      $scope.allOrgs = output.data;
      console.log($scope.allOrgs);
    })
  };






}]); // End Controller
